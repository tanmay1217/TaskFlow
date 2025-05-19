from flask import Flask, jsonify, request
from flask_cors import CORS
from app.models import db, Task
import uuid
from datetime import datetime
import os
import json

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///taskboard.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    with app.app_context():
        db.create_all()
        load_initial_tasks(app)

    @app.route('/api/tasks', methods=['GET'])
    def get_tasks():
        tasks = Task.query.order_by(Task.status, Task.position).all()
        return jsonify({'data': [task.to_dict() for task in tasks]})

    @app.route('/api/tasks', methods=['POST'])
    def create_task():
        data = request.json
        now = datetime.utcnow()
        status = data.get('status', 'todo')
        max_position = db.session.query(db.func.max(Task.position)).filter_by(status=status).scalar() or -1
        task = Task(
            id=str(uuid.uuid4()),
            title=data['title'],
            description=data.get('description', ''),
            status=status,
            position=max_position + 1,
            created_by=data.get('createdBy', ''),
            assigned_to=data.get('assignedTo', ''),
            created_at=now,
            updated_at=now
        )
        db.session.add(task)
        db.session.commit()
        return jsonify({'data': task.to_dict()})

    @app.route('/api/tasks/<task_id>', methods=['PUT'])
    def update_task(task_id):
        task = Task.query.get_or_404(task_id)
        data = request.json
        old_status = task.status
        old_position = task.position
        new_status = data.get('status', old_status)
        new_position = data.get('position', old_position)

        # If status or position changed, update positions in both columns
        if old_status != new_status or old_position != new_position:
            # Remove from old column
            old_column_tasks = Task.query.filter_by(status=old_status).filter(Task.id != task_id).order_by(Task.position).all()
            for i, t in enumerate(old_column_tasks):
                t.position = i

            # Insert into new column at the correct position
            new_column_tasks = Task.query.filter_by(status=new_status).filter(Task.id != task_id).order_by(Task.position).all()
            new_column_tasks.insert(new_position, task)
            for i, t in enumerate(new_column_tasks):
                t.position = i
                if t.id == task.id:
                    t.status = new_status

        # Always update title/description, created_by, assigned_to, and updated_at
        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.created_by = data.get('createdBy', task.created_by)
        task.assigned_to = data.get('assignedTo', task.assigned_to)
        task.updated_at = datetime.utcnow()
        db.session.commit()
        return jsonify({'data': task.to_dict()})

    @app.route('/api/tasks/<task_id>', methods=['DELETE'])
    def delete_task(task_id):
        task = Task.query.get_or_404(task_id)
        status = task.status
        db.session.delete(task)
        db.session.commit()
        # Reorder positions in the column
        column_tasks = Task.query.filter_by(status=status).order_by(Task.position).all()
        for i, t in enumerate(column_tasks):
            t.position = i
        db.session.commit()
        return jsonify({'data': None})

    return app 

def load_initial_tasks(app):
    with app.app_context():
        if Task.query.count() == 0:
            json_path = os.path.join(os.path.dirname(__file__), '../initial_tasks.json')
            if os.path.exists(json_path):
                with open(json_path, 'r') as f:
                    tasks = json.load(f)
                    for t in tasks:
                        created_at = datetime.fromisoformat(t['created_at'])
                        updated_at = datetime.fromisoformat(t['updated_at'])
                        task = Task(
                            id=t['id'],
                            title=t['title'],
                            description=t['description'],
                            status=t['status'],
                            position=t['position'],
                            created_by=t['created_by'],
                            assigned_to=t['assigned_to'],
                            created_at=created_at,
                            updated_at=updated_at
                        )
                        db.session.add(task)
                    db.session.commit() 
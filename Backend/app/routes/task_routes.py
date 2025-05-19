from flask import Blueprint, request, jsonify
from app.models.task import Task
from app import db
import uuid
from datetime import datetime

task_bp = Blueprint('tasks', __name__)

@task_bp.route('/board', methods=['GET'])
def get_board():
    tasks = Task.query.order_by(Task.position).all()
    tasks_dict = {task.id: task.to_dict() for task in tasks}
    
    # Create columns structure, ordering by position
    columns = {}
    for status, title in [('todo', 'To Do'), ('inProgress', 'In Progress'), ('done', 'Done')]:
        columns[status] = {
            'id': status,
            'title': title,
            'taskIds': [task.id for task in tasks if task.status == status]
        }
    
    return jsonify({
        'data': {
            'tasks': tasks_dict,
            'columns': columns,
            'columnOrder': ['todo', 'inProgress', 'done']
        }
    })

@task_bp.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    # Find the max position in the target column
    max_position = db.session.query(db.func.max(Task.position)).filter_by(status=data.get('status', 'todo')).scalar() or 0
    task = Task(
        id=str(uuid.uuid4()),
        title=data['title'],
        description=data.get('description', ''),
        status=data.get('status', 'todo'),
        position=max_position + 1
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({'data': task.to_dict()})

@task_bp.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.json
    old_status = task.status
    old_position = task.position
    new_status = data.get('status', task.status)
    new_position = data.get('position', task.position)

    # If status or position changed, update positions of other tasks
    if old_status != new_status or old_position != new_position:
        # Remove from old column
        tasks_in_old = Task.query.filter_by(status=old_status).order_by(Task.position).all()
        for i, t in enumerate([t for t in tasks_in_old if t.id != task.id]):
            t.position = i
        # Insert into new column
        tasks_in_new = Task.query.filter_by(status=new_status).order_by(Task.position).all()
        for i, t in enumerate(tasks_in_new):
            if i == new_position:
                task.position = new_position
                task.status = new_status
                task.updated_at = datetime.utcnow()
                db.session.add(task)
            t.position = i if i < new_position else i + 1
    else:
        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'data': task.to_dict()})

@task_bp.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    status = task.status
    db.session.delete(task)
    db.session.commit()
    # Reorder positions in the column
    tasks_in_column = Task.query.filter_by(status=status).order_by(Task.position).all()
    for i, t in enumerate(tasks_in_column):
        t.position = i
    db.session.commit()
    return jsonify({'data': None}) 
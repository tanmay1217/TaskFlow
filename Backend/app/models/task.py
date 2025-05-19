from app import db
from sqlalchemy import Column, String, DateTime, Enum, Integer
from datetime import datetime

class Task(db.Model):
    __tablename__ = 'tasks'

    id = Column(String(36), primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(String(1000))
    status = Column(Enum('todo', 'inProgress', 'done', name='task_status'), nullable=False)
    position = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'position': self.position,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        } 
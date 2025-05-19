import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Clock, User, UserPlus, X, Pencil } from 'lucide-react';
import { useBoard } from '../context/BoardContext';

const TaskCard = ({ task, index }) => {
  const { deleteTask, updateTask } = useBoard();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    createdBy: task.createdBy || '',
    assignedTo: task.assignedTo || '',
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateTask({
      ...task,
      ...editData,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white/80 rounded-lg shadow-md p-3 mb-2 border border-slate-200 backdrop-blur-md">
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleEditChange}
            className="w-full p-2 border border-slate-200 rounded mb-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            required
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleEditChange}
            className="w-full p-2 border border-slate-200 rounded mb-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            rows={2}
          />
          <input
            type="text"
            name="createdBy"
            value={editData.createdBy}
            onChange={handleEditChange}
            className="w-full p-2 border border-slate-200 rounded mb-2 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Created by"
          />
          <input
            type="text"
            name="assignedTo"
            value={editData.assignedTo}
            onChange={handleEditChange}
            className="w-full p-2 border border-slate-200 rounded mb-3 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Assigned to"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold shadow text-xs"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-slate-100 text-slate-600 px-3 py-1.5 rounded hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 font-semibold shadow text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white/80 rounded-lg shadow-md p-3 mb-2 border border-slate-200 hover:shadow-lg transition-all duration-200 backdrop-blur-md ${
            snapshot.isDragging ? 'shadow-xl scale-[1.02] ring-2 ring-blue-400' : ''
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-slate-800 line-clamp-2 text-base tracking-tight drop-shadow-sm">
              {task.title}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="text-slate-400 hover:text-blue-500 transition-colors p-1 hover:bg-blue-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-label="Edit task"
                type="button"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full focus:outline-none focus:ring-2 focus:ring-red-200"
                aria-label="Delete task"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-600 mb-2 line-clamp-2">{task.description}</p>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
            <div className="flex items-center bg-slate-50 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatDate(task.createdAt)}</span>
            </div>
            {task.createdBy && (
              <div className="flex items-center bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                <User className="w-3 h-3 mr-1" />
                <span>{task.createdBy}</span>
              </div>
            )}
            {task.assignedTo && (
              <div className="flex items-center bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                <UserPlus className="w-3 h-3 mr-1" />
                <span>{task.assignedTo}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard; 
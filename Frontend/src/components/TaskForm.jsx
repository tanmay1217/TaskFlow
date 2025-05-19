import React, { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import { Plus } from 'lucide-react';

const TaskForm = ({ columnId }) => {
  const { createTask } = useBoard();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    createdBy: '',
    assignedTo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    createTask({
      ...formData,
      columnId
    });
    setFormData({
      title: '',
      description: '',
      createdBy: '',
      assignedTo: ''
    });
    setIsFormVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isFormVisible) {
    return (
      <button
        onClick={() => setIsFormVisible(true)}
        className="w-full text-left p-2 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors flex items-center group font-medium"
      >
        <Plus className="w-3 h-3 mr-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
        Add Task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 rounded-lg shadow-md p-3 mb-2 border border-slate-200 backdrop-blur-md">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Task title"
        className="w-full p-2 border border-slate-200 rounded mb-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
        autoFocus
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Task description"
        className="w-full p-2 border border-slate-200 rounded mb-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
        rows="2"
      />
      <input
        type="text"
        name="createdBy"
        value={formData.createdBy}
        onChange={handleChange}
        placeholder="Created by"
        className="w-full p-2 border border-slate-200 rounded mb-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
      />
      <input
        type="text"
        name="assignedTo"
        value={formData.assignedTo}
        onChange={handleChange}
        placeholder="Assigned to"
        className="w-full p-2 border border-slate-200 rounded mb-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 font-semibold shadow text-sm"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={() => setIsFormVisible(false)}
          className="flex-1 bg-slate-100 text-slate-600 px-3 py-1.5 rounded hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 font-semibold shadow text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm; 
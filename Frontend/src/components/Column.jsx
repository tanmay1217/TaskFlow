import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

// Define a palette of Tailwind base colors
const COLUMN_COLORS = [
  'bg-blue-500',
  'bg-yellow-400',
  'bg-green-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-orange-400',
];

const Column = ({ column, tasks, index }) => {
  // Pick a color based on the column index
  const colorClass = COLUMN_COLORS[index % COLUMN_COLORS.length];

  return (
    <div className="bg-white/90 rounded-lg overflow-hidden flex flex-col shadow-lg h-full border border-slate-200 transition-all duration-200 hover:shadow-xl">
      {/* Colored accent bar */}
      <div className={`${colorClass} h-1.5 w-full`} />
      <div className="p-3 bg-white border-b border-slate-100">
        <h2 className="font-semibold text-slate-800 text-base tracking-tight">{column.title}</h2>
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-2 flex-grow transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
              <TaskForm columnId={column.id} />
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column; 
import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import { useBoard } from '../context/BoardContext';

const TaskBoard = () => {
  const { board, loading, error, moveTask } = useBoard();

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) return;

    moveTask(
      draggableId,
      {
        columnId: source.droppableId,
        index: source.index
      },
      {
        columnId: destination.droppableId,
        index: destination.index
      }
    );
  };

  if (loading && !board) {
    return <BoardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl max-w-md shadow-lg">
          <h3 className="font-semibold text-lg mb-2">Error Loading Board</h3>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl max-w-md text-center shadow-lg">
          <h3 className="font-semibold text-lg text-slate-800 mb-2">No Board Data</h3>
          <p className="text-slate-600">There is no data available for this board.</p>
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-2 md:p-4">
        {board.columnOrder.map((columnId, index) => {
          const column = board.columns[columnId];
          const tasks = column.taskIds.map(taskId => board.tasks[taskId]);
          
          return (
            <Column 
              key={column.id} 
              column={column} 
              tasks={tasks} 
              index={index} 
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

// Loading skeleton for the board
const BoardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-2 md:p-4">
      {[1, 2, 3].map(index => (
        <div key={index} className="bg-white/70 rounded-2xl overflow-hidden flex flex-col shadow-lg h-full min-h-[60vh] border border-slate-200 animate-pulse">
          <div className="h-2 w-full bg-slate-200" />
          <div className="p-6 bg-white border-b border-slate-100 h-16"></div>
          <div className="p-6 flex-grow space-y-6">
            {[1, 2, 3, 4].map(taskIndex => (
              <div key={taskIndex} className="bg-slate-100 rounded-xl p-6 h-28 shadow-sm">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard; 
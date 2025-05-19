import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const BoardContext = createContext(undefined);

const COLUMN_TITLES = {
  todo: 'To Do',
  inProgress: 'In Progress',
  done: 'Done',
};

export const BoardProvider = ({ children }) => {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshBoard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getTasks();
      if (response.error) {
        setError(response.error);
      } else {
        // Group tasks by status and order by position
        const tasksArr = response.data;
        const tasks = {};
        const columns = {
          todo: { id: 'todo', title: COLUMN_TITLES['todo'], taskIds: [] },
          inProgress: { id: 'inProgress', title: COLUMN_TITLES['inProgress'], taskIds: [] },
          done: { id: 'done', title: COLUMN_TITLES['done'], taskIds: [] },
        };
        tasksArr.forEach(task => {
          tasks[task.id] = task;
          columns[task.status].taskIds.push(task.id);
        });
        // Sort taskIds by position
        Object.keys(columns).forEach(status => {
          columns[status].taskIds.sort((a, b) => tasks[a].position - tasks[b].position);
        });
        setBoard({
          tasks,
          columns,
          columnOrder: ['todo', 'inProgress', 'done'],
        });
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBoard();
  }, []);

  const createTask = async (task) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.createTask(task);
      if (response.error) {
        setError(response.error);
      } else {
        await refreshBoard();
      }
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (task) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.updateTask(task);
      if (response.error) {
        setError(response.error);
      } else {
        await refreshBoard();
      }
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.deleteTask(taskId);
      if (response.error) {
        setError(response.error);
      } else {
        await refreshBoard();
      }
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const moveTask = async (taskId, source, destination) => {
    console.log('moveTask called', { taskId, source, destination });
    if (!destination) return;
    if (
      source.columnId === destination.columnId &&
      source.index === destination.index
    ) {
      return;
    }
    try {
      // Optimistic UI update
      if (board) {
        const newBoard = JSON.parse(JSON.stringify(board));
        const sourceColumn = newBoard.columns[source.columnId];
        const destColumn = newBoard.columns[destination.columnId];
        const sourceTaskIds = Array.from(sourceColumn.taskIds);
        sourceTaskIds.splice(source.index, 1);
        const destTaskIds =
          source.columnId === destination.columnId
            ? sourceTaskIds
            : Array.from(destColumn.taskIds);
        destTaskIds.splice(destination.index, 0, taskId);
        newBoard.columns[source.columnId].taskIds = sourceTaskIds;
        newBoard.columns[destination.columnId].taskIds = destTaskIds;
        newBoard.tasks[taskId] = {
          ...newBoard.tasks[taskId],
          status: destination.columnId,
          position: destination.index,
        };
        setBoard(newBoard);
        console.log('Optimistically updated board', newBoard);
      }
      // Persist to backend
      const response = await api.updateTaskStatus(
        taskId,
        destination.columnId,
        destination.index
      );
      console.log('Backend response for updateTaskStatus', response);
      if (response.error) {
        setError(response.error);
        await refreshBoard();
      }
    } catch (err) {
      setError('Failed to move task');
      await refreshBoard();
    }
  };

  const value = {
    board,
    loading,
    error,
    refreshBoard,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
  };

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}; 
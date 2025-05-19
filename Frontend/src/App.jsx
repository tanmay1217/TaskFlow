import React from 'react';
import { BoardProvider } from './context/BoardContext';
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';

const App = () => {
  return (
    <BoardProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
        <Header />
        <main className="container mx-auto px-2 md:px-6 py-8">
          <div className="rounded-3xl bg-white/80 shadow-2xl border border-slate-200 p-2 md:p-8">
            <TaskBoard />
          </div>
        </main>
        <footer className="py-4 text-center text-sm text-slate-500 border-t border-slate-200 bg-white mt-auto">
          <p>TaskFlow Board - Task Management App</p>
        </footer>
      </div>
    </BoardProvider>
  );
};

export default App; 
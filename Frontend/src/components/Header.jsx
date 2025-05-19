import React from 'react';
import { Trello } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl sticky top-0 z-20 border-b border-blue-700/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-xl shadow-lg border border-white/20">
            <Trello className="text-white drop-shadow-lg" size={24} />
            <h1 className="text-xl font-bold text-white tracking-tight drop-shadow">TaskFlow</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
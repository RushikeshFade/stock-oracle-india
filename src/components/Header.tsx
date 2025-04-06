
import React from 'react';
import { LineChart, TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="gradient-bg text-white py-6 px-4 sm:px-6 md:px-8 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Stock Oracle</h1>
            <p className="text-sm text-white/70">ML-powered Indian Stock Price Predictions</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <LineChart className="h-5 w-5" />
          <span className="font-medium">LSTM + CNN Models</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

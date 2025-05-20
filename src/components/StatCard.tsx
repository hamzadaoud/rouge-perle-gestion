
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-md transition-transform duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-semibold text-gray-600 truncate">{title}</h3>
          <p className="mt-1 md:mt-2 text-xl md:text-2xl font-bold text-cafeBlack">{value}</p>
        </div>
        <div className="text-cafeRed ml-4">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;

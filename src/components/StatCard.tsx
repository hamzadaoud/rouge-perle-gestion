
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md transition-transform duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
          <p className="mt-2 text-2xl font-bold text-cafeBlack">{value}</p>
        </div>
        <div className="text-cafeRed">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;

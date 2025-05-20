
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getRevenues } from '../services/cafeService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenuePage: React.FC = () => {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  useEffect(() => {
    const revenues = getRevenues();
    setRevenueData(revenues);
    
    const total = revenues.reduce((sum, item) => sum + item.amount, 0);
    setTotalRevenue(total);
  }, []);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  };
  
  const chartData = revenueData.map(item => ({
    name: formatDate(item.date),
    revenue: item.amount
  })).slice(0, 10);
  
  return (
    <DashboardLayout requireAdmin={true}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-cafeBlack">Revenus</h1>
        <p className="text-gray-500">Analyse des revenus du café</p>
      </div>
      
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-lg font-medium text-gray-500">Revenu Total</h2>
          <p className="text-3xl font-bold text-cafeRed">{totalRevenue.toFixed(2)} €</p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-lg font-medium text-gray-500">Nombre de Jours</h2>
          <p className="text-3xl font-bold text-cafeBlack">{revenueData.length}</p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-lg font-medium text-gray-500">Moyenne Journalière</h2>
          <p className="text-3xl font-bold text-cafeBlack">
            {revenueData.length ? (totalRevenue / revenueData.length).toFixed(2) : 0} €
          </p>
        </div>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-xl font-semibold text-cafeBlack">Évolution des Revenus</h2>
        
        {chartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} €`, 'Revenu']}
                />
                <Bar dataKey="revenue" fill="#e63946" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-80 items-center justify-center text-gray-500">
            Aucune donnée de revenu disponible
          </div>
        )}
      </div>
      
      <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-cafeBlack">Détails des Revenus</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left font-semibold text-cafeBlack">Date</th>
                <th className="pb-3 text-right font-semibold text-cafeBlack">Revenu</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-500">
                    Aucune donnée de revenu disponible
                  </td>
                </tr>
              ) : (
                revenueData.map((revenue, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-0">
                    <td className="py-3">{new Date(revenue.date).toLocaleDateString()}</td>
                    <td className="py-3 text-right font-medium">{revenue.amount.toFixed(2)} €</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RevenuePage;

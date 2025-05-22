
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getRevenues } from '../services/cafeService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarDays, Calendar } from 'lucide-react';

const RevenuePage: React.FC = () => {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [periodType, setPeriodType] = useState<'day' | 'month' | 'year' | 'custom'>('day');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  useEffect(() => {
    const revenues = getRevenues();
    setRevenueData(revenues);
    
    // Par défaut, on filtre sur la journée en cours
    filterByPeriod('day');
  }, []);
  
  const filterByPeriod = (period: 'day' | 'month' | 'year' | 'custom', customStart?: string, customEnd?: string) => {
    const revenues = getRevenues();
    let filtered = [];
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (period) {
      case 'day':
        filtered = revenues.filter(item => item.date === todayStr);
        setStartDate(todayStr);
        setEndDate(todayStr);
        break;
        
      case 'month':
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        filtered = revenues.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === currentMonth && 
                 itemDate.getFullYear() === currentYear;
        });
        setStartDate(new Date(currentYear, currentMonth, 1).toISOString().split('T')[0]);
        setEndDate(new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]);
        break;
        
      case 'year':
        const year = today.getFullYear();
        filtered = revenues.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getFullYear() === year;
        });
        setStartDate(new Date(year, 0, 1).toISOString().split('T')[0]);
        setEndDate(new Date(year, 11, 31).toISOString().split('T')[0]);
        break;
        
      case 'custom':
        if (customStart && customEnd) {
          filtered = revenues.filter(item => {
            return item.date >= customStart && item.date <= customEnd;
          });
          setStartDate(customStart);
          setEndDate(customEnd);
        }
        break;
    }
    
    setPeriodType(period);
    setFilteredData(filtered);
    
    const total = filtered.reduce((sum, item) => sum + item.amount, 0);
    setTotalRevenue(total);
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  };
  
  const chartData = filteredData.map(item => ({
    name: formatDate(item.date),
    revenue: item.amount
  })).slice(0, 20); // Limit to 20 items for better visualization
  
  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      filterByPeriod('custom', startDate, endDate);
    }
  };
  
  return (
    <DashboardLayout requireAdmin={true}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-cafeBlack">Revenus</h1>
        <p className="text-gray-500">Analyse des revenus du café</p>
      </div>
      
      <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => filterByPeriod('day')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 ${periodType === 'day' ? 'bg-cafeRed text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            <CalendarDays size={16} />
            Aujourd'hui
          </button>
          
          <button
            onClick={() => filterByPeriod('month')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 ${periodType === 'month' ? 'bg-cafeRed text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            <Calendar size={16} />
            Ce mois
          </button>
          
          <button
            onClick={() => filterByPeriod('year')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 ${periodType === 'year' ? 'bg-cafeRed text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            <Calendar size={16} />
            Cette année
          </button>
          
          <div className={`flex items-center gap-4 rounded-md px-4 py-2 ${periodType === 'custom' ? 'bg-cafeRed text-white' : 'bg-gray-100 text-gray-700'}`}>
            <span className="hidden md:inline">Personnalisé:</span>
            <div className="flex flex-wrap gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`rounded border px-2 py-1 ${periodType === 'custom' ? 'bg-white text-gray-700' : 'bg-white text-gray-700'}`}
              />
              <span>à</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`rounded border px-2 py-1 ${periodType === 'custom' ? 'bg-white text-gray-700' : 'bg-white text-gray-700'}`}
              />
              <button
                onClick={handleCustomDateChange}
                className="rounded bg-gray-700 px-3 text-white hover:bg-gray-800"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-lg font-medium text-gray-500">Revenu Total</h2>
          <p className="text-3xl font-bold text-cafeRed">{totalRevenue.toFixed(2)} €</p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-lg font-medium text-gray-500">Période</h2>
          <p className="text-lg font-bold text-cafeBlack">
            {startDate === endDate 
              ? formatDate(startDate) 
              : `${formatDate(startDate)} - ${formatDate(endDate)}`}
          </p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-lg font-medium text-gray-500">Moyenne Journalière</h2>
          <p className="text-3xl font-bold text-cafeBlack">
            {filteredData.length ? (totalRevenue / filteredData.length).toFixed(2) : 0} €
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
            Aucune donnée de revenu disponible pour cette période
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
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-500">
                    Aucune donnée de revenu disponible pour cette période
                  </td>
                </tr>
              ) : (
                filteredData.map((revenue, index) => (
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


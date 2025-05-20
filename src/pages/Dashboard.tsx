
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import { Activity, BarChart2, Calendar, Coffee, CreditCard, User, Users } from 'lucide-react';
import { getOrders, getRevenues, getTimeLogs } from '../services/cafeService';
import { getStoredActivities } from '../services/authService';

const Dashboard: React.FC = () => {
  const [ordersCount, setOrdersCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    // Charger les données
    const orders = getOrders();
    setOrdersCount(orders.length);
    
    const revenues = getRevenues();
    const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
    setRevenue(totalRevenue);
    
    const timeLogs = getTimeLogs();
    const today = new Date().toISOString().split('T')[0];
    const activeToday = new Set(
      timeLogs
        .filter(log => log.date === today)
        .map(log => log.userId)
    );
    setActiveUsers(activeToday.size);
    
    const activities = getStoredActivities().slice(0, 10);
    setRecentActivities(activities);
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-cafeBlack">Tableau de Bord</h1>
        <p className="text-gray-500">Bienvenue sur votre tableau de bord de La Perle Rouge</p>
      </div>
      
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Commandes Totales" 
          value={ordersCount} 
          icon={<Coffee size={24} />} 
        />
        <StatCard 
          title="Revenu Total" 
          value={`${revenue.toFixed(2)} €`} 
          icon={<CreditCard size={24} />} 
        />
        <StatCard 
          title="Agents Actifs Aujourd'hui" 
          value={activeUsers} 
          icon={<Users size={24} />} 
        />
        <StatCard 
          title="Activités Récentes" 
          value={recentActivities.length} 
          icon={<Activity size={24} />} 
        />
      </div>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-cafeBlack">Activités Récentes</h2>
        <div className="rounded-lg bg-white p-4 shadow-md">
          {recentActivities.length === 0 ? (
            <p className="text-gray-500">Aucune activité récente</p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="mb-3 flex items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-cafeRed text-white">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.userName}</p>
                    <p className="text-xs text-gray-500">{activity.action}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

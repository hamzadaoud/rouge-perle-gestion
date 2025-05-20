
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Calendar, LogIn, LogOut } from 'lucide-react';
import { TimeLog } from '../types';
import { clockIn, clockOut, getTimeLogs } from '../services/cafeService';
import { getCurrentUser } from '../services/authService';

const TimeTrackingPage: React.FC = () => {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentLog, setCurrentLog] = useState<TimeLog | null>(null);
  
  const user = getCurrentUser();
  
  useEffect(() => {
    const logs = getTimeLogs();
    setTimeLogs(logs);
    
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const userLog = logs.find(
        log => log.userId === user.id && 
        log.date === today && 
        !log.clockOut
      );
      
      if (userLog) {
        setIsClockedIn(true);
        setCurrentLog(userLog);
      }
    }
  }, []);
  
  const handleClockIn = () => {
    const log = clockIn();
    if (log) {
      setTimeLogs([...timeLogs, log]);
      setIsClockedIn(true);
      setCurrentLog(log);
    }
  };
  
  const handleClockOut = () => {
    const log = clockOut();
    if (log) {
      setTimeLogs(timeLogs.map(l => 
        l.id === log.id ? log : l
      ));
      setIsClockedIn(false);
      setCurrentLog(null);
    }
  };
  
  // Filtrer les logs de l'utilisateur actuel pour les agents
  // Les administrateurs voient tous les logs
  const filteredLogs = user?.role === 'admin' 
    ? timeLogs 
    : timeLogs.filter(log => log.userId === user?.id);
  
  // Trier les logs par date, du plus récent au plus ancien
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    return new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime();
  });
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatDuration = (clockIn: Date, clockOut?: Date) => {
    if (!clockOut) return 'En cours';
    
    const diffMs = new Date(clockOut).getTime() - new Date(clockIn).getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}min`;
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-cafeBlack">Pointage</h1>
        <p className="text-gray-500">Gérez vos heures de travail</p>
      </div>
      
      <div className="mb-8 flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 text-xl font-semibold text-cafeBlack">Pointage Journalier</h2>
          
          {currentLog && (
            <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">
              <p>Vous êtes actuellement pointé depuis {formatTime(currentLog.clockIn)}</p>
            </div>
          )}
          
          <div className="flex justify-center gap-4">
            <button
              onClick={handleClockIn}
              disabled={isClockedIn}
              className={`flex items-center rounded-md px-6 py-3 font-medium text-white ${
                isClockedIn 
                  ? 'cursor-not-allowed bg-gray-400' 
                  : 'bg-cafeRed hover:bg-red-700'
              }`}
            >
              <LogIn size={18} className="mr-2" />
              Pointer Arrivée
            </button>
            
            <button
              onClick={handleClockOut}
              disabled={!isClockedIn}
              className={`flex items-center rounded-md px-6 py-3 font-medium text-white ${
                !isClockedIn 
                  ? 'cursor-not-allowed bg-gray-400' 
                  : 'bg-cafeBlack hover:bg-gray-700'
              }`}
            >
              <LogOut size={18} className="mr-2" />
              Pointer Départ
            </button>
          </div>
        </div>
        
        <div className="w-full lg:w-96">
          <h2 className="mb-4 text-xl font-semibold text-cafeBlack">Calendrier</h2>
          
          <div className="rounded-lg bg-white p-4 shadow-md">
            <div className="flex flex-col items-center justify-center py-4 text-cafeRed">
              <Calendar size={48} className="mb-2" />
              <p className="text-xl font-bold">
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="mb-4 text-xl font-semibold text-cafeBlack">
          {user?.role === 'admin' ? 'Tous les Pointages' : 'Mes Pointages'}
        </h2>
        
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  {user?.role === 'admin' && (
                    <th className="pb-3 text-left font-semibold text-cafeBlack">Agent</th>
                  )}
                  <th className="pb-3 text-left font-semibold text-cafeBlack">Date</th>
                  <th className="pb-3 text-left font-semibold text-cafeBlack">Arrivée</th>
                  <th className="pb-3 text-left font-semibold text-cafeBlack">Départ</th>
                  <th className="pb-3 text-left font-semibold text-cafeBlack">Durée</th>
                </tr>
              </thead>
              <tbody>
                {sortedLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 last:border-0">
                    {user?.role === 'admin' && (
                      <td className="py-3">{log.userName}</td>
                    )}
                    <td className="py-3">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="py-3">{formatTime(log.clockIn)}</td>
                    <td className="py-3">{log.clockOut ? formatTime(log.clockOut) : 'En cours'}</td>
                    <td className="py-3">{formatDuration(log.clockIn, log.clockOut)}</td>
                  </tr>
                ))}
                {sortedLogs.length === 0 && (
                  <tr>
                    <td 
                      colSpan={user?.role === 'admin' ? 5 : 4} 
                      className="py-4 text-center text-gray-500"
                    >
                      Aucun pointage enregistré
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TimeTrackingPage;

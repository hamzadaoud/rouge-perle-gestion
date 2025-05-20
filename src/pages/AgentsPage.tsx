
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { User, Mail } from 'lucide-react';

const AgentsPage: React.FC = () => {
  // Données des agents (normalement à récupérer depuis une API/BDD)
  const agents = [
    {
      id: "agent1",
      name: "Jean Dupont",
      email: "jean@laperle.rouge",
      role: "agent",
      avatar: "JD",
      status: "active",
    },
    {
      id: "agent2",
      name: "Marie Martin",
      email: "marie@laperle.rouge",
      role: "agent",
      avatar: "MM",
      status: "active",
    },
    {
      id: "admin1",
      name: "Administrateur",
      email: "admin@laperle.rouge",
      role: "admin",
      avatar: "AD",
      status: "active",
    }
  ];

  return (
    <DashboardLayout requireAdmin={true}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-cafeBlack">Gestion des Agents</h1>
        <p className="text-gray-500">Liste des employés de La Perle Rouge</p>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left font-semibold text-cafeBlack">Agent</th>
                <th className="pb-3 text-left font-semibold text-cafeBlack">Email</th>
                <th className="pb-3 text-left font-semibold text-cafeBlack">Rôle</th>
                <th className="pb-3 text-left font-semibold text-cafeBlack">Statut</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-cafeRed text-white">
                        {agent.avatar}
                      </div>
                      <span>{agent.name}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2 text-gray-400" />
                      {agent.email}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      agent.role === 'admin' 
                        ? 'bg-cafeRed text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {agent.role === 'admin' ? 'Administrateur' : 'Agent'}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center">
                      <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                      Actif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button
            className="rounded-md bg-cafeRed px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
            onClick={() => alert("La fonctionnalité d'ajout d'agent sera disponible prochainement")}
          >
            <User size={18} className="mr-2 inline" />
            Ajouter un agent
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentsPage;

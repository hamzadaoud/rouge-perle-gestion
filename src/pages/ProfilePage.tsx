
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getCurrentUser } from '../services/authService';
import { User, Mail, Clock } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const user = getCurrentUser();
  
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-cafeBlack">Mon Profil</h1>
        <p className="text-gray-500">Informations personnelles</p>
      </div>
      
      <div className="mb-8 rounded-lg bg-white p-8 shadow-md">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-cafeRed text-3xl font-bold text-white">
            {user.name.charAt(0)}
          </div>
          <h2 className="mb-2 text-2xl font-bold text-cafeBlack">{user.name}</h2>
          <p className="mb-4 text-gray-500">{user.role === 'admin' ? 'Administrateur' : 'Agent'}</p>
          
          <div className="w-full max-w-md">
            <div className="mb-4 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center">
                <Mail size={18} className="mr-3 text-cafeRed" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center">
                <User size={18} className="mr-3 text-cafeRed" />
                <div>
                  <p className="text-sm text-gray-500">Identifiant</p>
                  <p className="font-medium">{user.id}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center">
                <Clock size={18} className="mr-3 text-cafeRed" />
                <div>
                  <p className="text-sm text-gray-500">Dernière connexion</p>
                  <p className="font-medium">{new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          className="rounded-md bg-cafeRed px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
          onClick={() => alert("La fonctionnalité de mise à jour du profil sera disponible prochainement")}
        >
          Mettre à jour mon profil
        </button>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;

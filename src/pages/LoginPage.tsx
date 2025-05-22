
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { authenticate, getCurrentUser } from '../services/authService';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const user = getCurrentUser();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    const user = authenticate(email, password);
    
    if (user) {
      window.location.href = '/dashboard';
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <AuthLayout title="Connexion">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-cafeBlack">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="cafe-input w-full"
            placeholder="votre@email.com"
          />
        </div>
        
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-cafeBlack">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="cafe-input w-full"
            placeholder="••••••••"
          />
        </div>
        
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-md bg-cafeRed py-3 font-medium text-white transition-colors hover:bg-red-700"
        >
          <LogIn size={18} className="mr-2" />
          Se connecter
        </button>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Utilisateur de démonstration:</p>
          <p className="font-medium">
            Admin: Mostapha@perle-rouge.com / DARANE1967
          </p>
          <p className="font-medium">
            Agent: Aziz@perle-rouge.com / AZIZ3435
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;

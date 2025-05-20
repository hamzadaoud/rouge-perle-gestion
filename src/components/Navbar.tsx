
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { User } from '../types';
import { LogOut } from 'lucide-react';
import { logout } from '../services/authService';

interface NavbarProps {
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="sticky top-0 z-10 bg-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-cafeBlack">
            {user.name} <span className="text-cafeRed">({user.role === 'admin' ? 'Admin' : 'Agent'})</span>
          </span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center text-cafeRed hover:text-red-700"
            title="Déconnexion"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

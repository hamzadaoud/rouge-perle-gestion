
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, User, Users, Receipt, Calendar, BarChart2, Activity, CreditCard } from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarProps {
  user: UserType;
}

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const location = useLocation();
  const isAdmin = user.role === 'admin';
  
  const links: SidebarLink[] = [
    {
      to: '/dashboard',
      label: 'Tableau de Bord',
      icon: <Activity size={20} />,
    },
    {
      to: '/orders',
      label: 'Commandes',
      icon: <Coffee size={20} />,
    },
    {
      to: '/time-tracking',
      label: 'Pointage',
      icon: <Calendar size={20} />,
    },
    {
      to: '/agents',
      label: 'Agents',
      icon: <Users size={20} />,
      adminOnly: true,
    },
    {
      to: '/invoices',
      label: 'Factures',
      icon: <Receipt size={20} />,
      adminOnly: true,
    },
    {
      to: '/revenue',
      label: 'Revenus',
      icon: <BarChart2 size={20} />,
      adminOnly: true,
    },
    {
      to: '/profile',
      label: 'Mon Profil',
      icon: <User size={20} />,
    },
  ];
  
  const filteredLinks = links.filter(link => !link.adminOnly || isAdmin);

  return (
    <aside className="w-64 bg-cafeBlack">
      <div className="py-4">
        {filteredLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-4 py-3 transition-colors ${
                isActive
                  ? 'bg-cafeRed text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;

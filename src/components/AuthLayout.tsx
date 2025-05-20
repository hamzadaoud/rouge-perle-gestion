
import React from 'react';
import Logo from './Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cafeLightGray">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="cafe-card">
          <h1 className="mb-6 text-center text-2xl font-bold text-cafeBlack">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

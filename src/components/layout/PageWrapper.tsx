import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 ml-64 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

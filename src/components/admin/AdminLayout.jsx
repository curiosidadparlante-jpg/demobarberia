import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ShopBackground } from '../ShopBackground';
import { Calendar, User, LogOut, Scissors, Users, Settings, FileText } from 'lucide-react';
import { api } from '../../services/api';

export function AdminLayout({ children, title, subtitle, extraNav }) {
  const navigate = useNavigate();
  const location = useLocation();
  const barber = JSON.parse(localStorage.getItem('barber') || '{"role":"OWNER", "nombre":"Admin Local"}');
  const [config, setConfig] = useState({ nombreLocal: 'Estilo Cruz', logoUrl: '/logo.png' });

  useEffect(() => {
    api.getConfig().then(data => {
      if (data) setConfig(data);
    });
  }, []);

  const handleLogout = () => {
    api.logout();
    api.logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin', icon: Calendar, label: 'Turnos', role: 'BARBER' },
    { path: '/admin/profile', icon: User, label: 'Mi Perfil', role: 'BARBER' },
    { path: '/admin/services', icon: Scissors, label: 'Servicios', role: 'BARBER', permission: 'canEditServices' },
    { path: '/admin/staff', icon: Users, label: 'Staff', role: 'OWNER' },
    { path: '/admin/clients', icon: FileText, label: 'Clientes', role: 'OWNER' },
    { path: '/admin/settings', icon: Settings, label: 'Ajustes', role: 'OWNER' },
  ];

  const canSee = (item) => {
    if (barber.role === 'OWNER') return true;
    if (item.role === 'BARBER') {
      if (!item.permission) return true;
      return !!barber[item.permission];
    }
    return false;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-x-hidden">
      <ShopBackground />

      <div className="max-w-4xl mx-auto relative z-10 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-3 md:p-5 border-[4px] border-brand-dark min-h-[85vh] flex flex-col overflow-hidden">
        <header className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-brand-dark/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-brand-dark rounded-full p-1.5 border-2 border-brand-orange shadow-lg">
                <img src={config.logoUrl || '/logo.png'} alt="Admin" className="w-8 h-8 object-contain rounded-full" />
             </div>
             <div>
                <h1 className="text-lg font-black text-brand-dark uppercase tracking-tighter leading-none">{config.nombreLocal}</h1>
                <p className="text-brand-orange font-black text-[8px] tracking-[0.2em] uppercase opacity-90">{title || `Hola, ${barber.nombre}`}</p>
             </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              if (!canSee(item)) return null;
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all
                    ${isActive 
                      ? 'bg-brand-dark text-white shadow-lg' 
                      : 'bg-brand-dark/5 text-brand-dark hover:bg-brand-dark/10'}`}
                >
                  <item.icon size={12} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all ml-auto md:ml-0"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Salir</span>
            </button>
            
            {/* Page specific extra nav items */}
            {extraNav || null}
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto pr-2 hide-scrollbar animate-fade-in-up">
          {children}
        </main>
      </div>


    </div>
  );
}

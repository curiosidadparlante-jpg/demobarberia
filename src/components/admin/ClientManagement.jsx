import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { api } from '../../services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, User, Phone, Calendar, Clock, X, CheckCircle, XCircle } from 'lucide-react';

export function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (err) {
      setError('Error al cargar la lista de clientes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Directorio de Clientes">
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-brand-dark uppercase tracking-widest flex items-center gap-2">
            <FileText className="text-brand-orange" />
            Mis Clientes
          </h2>
          <div className="bg-brand-dark text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-widest">
            {clients.length} Registrados
          </div>
        </header>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl font-bold text-sm border-2 border-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mx-auto mb-4"></div>
            <p className="text-brand-dark/50 font-bold text-sm uppercase tracking-widest">Cargando directorio...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {clients.map(client => (
              <div 
                key={client.telefono} 
                className="bg-white border-2 border-brand-dark/10 rounded-2xl p-4 flex flex-col justify-between hover:border-brand-orange/30 transition-colors group shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-brand-orange/10 p-2 flex-shrink-0 rounded-full text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                      <User size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-brand-dark text-base md:text-lg leading-tight truncate">{client.nombre}</h3>
                      <p className="text-xs md:text-sm text-brand-dark/60 font-medium flex items-center gap-1 mt-1 truncate">
                        <Phone size={12} /> {client.telefono}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 flex-shrink-0">
                    <div className="bg-brand-dark/5 p-1.5 md:p-2 rounded-lg flex flex-col items-center justify-center min-w-[2.5rem] md:min-w-[3rem]">
                      <span className="font-black text-sm md:text-base text-brand-dark leading-none">{client.totalTurnos}</span>
                      <span className="text-[7px] font-bold text-brand-dark/60 uppercase mt-0.5">Total</span>
                    </div>
                    <div className="bg-green-50 p-1.5 md:p-2 rounded-lg flex flex-col items-center justify-center min-w-[2.5rem] md:min-w-[3rem]">
                      <span className="font-black text-sm md:text-base text-green-600 leading-none">{client.completados}</span>
                      <span className="text-[7px] font-bold text-green-600/80 uppercase mt-0.5">Asistió</span>
                    </div>
                    <div className="bg-red-50 p-1.5 md:p-2 rounded-lg flex flex-col items-center justify-center min-w-[2.5rem] md:min-w-[3rem]">
                      <span className="font-black text-sm md:text-base text-red-500 leading-none">{client.cancelados}</span>
                      <span className="text-[7px] font-bold text-red-500/80 uppercase mt-0.5">Canceló</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';
import { Scissors, Plus, Trash2, Save, X, Clock, DollarSign } from 'lucide-react';

export function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', duracionMinutos: 30, precio: 0 });

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (err) {
      setError('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({ nombre: service.nombre, duracionMinutos: service.duracionMinutos, precio: service.precio });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) return;
    try {
      await api.deleteService(id);
      setServices(services.filter(s => s.id !== id));
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        const updated = await api.updateService(editingService.id, formData);
        setServices(services.map(s => s.id === updated.id ? updated : s));
      } else {
        const created = await api.createService(formData);
        setServices([...services, created]);
      }
      setShowForm(false);
      setEditingService(null);
      setFormData({ nombre: '', duracionMinutos: 30, precio: 0 });
    } catch (err) {
      alert('Error al guardar');
    }
  };

  return (
    <AdminLayout title="Servicios" subtitle="Gestionar servicios">
      {loading ? (
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-orange"></div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 h-full">
          <header className="flex justify-between items-center mb-4 gap-2">
            <div>
              <h2 className="text-lg font-black text-brand-dark uppercase tracking-tighter">Lista de Servicios</h2>
              <p className="text-gray-500 font-bold text-[7px] uppercase tracking-widest">Total: {services.length}</p>
            </div>
            <button
              onClick={() => { setShowForm(true); setEditingService(null); setFormData({ nombre: '', duracionMinutos: 30, precio: 0 }); }}
              className="bg-brand-orange text-white px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-[0_3px_0_0_#8C4126] hover:translate-y-0.5 active:shadow-none active:translate-y-1 transition-all flex items-center gap-2"
            >
              <Plus size={14} />
              <span>Nuevo</span>
            </button>
          </header>

          {showForm && (
            <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-2">
              <div className="bg-white rounded-[1.5rem] p-5 max-w-[300px] w-full shadow-2xl relative border-[3px] border-brand-dark">
                <h2 className="text-lg font-black text-brand-dark uppercase tracking-tighter mb-4">{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[7px] font-black text-brand-purple uppercase tracking-widest mb-1 ml-1">Nombre</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-brand-dark/5 border-b-2 border-brand-dark rounded-lg px-3 py-2 focus:outline-none focus:bg-brand-orange/5 transition-all font-bold text-[11px]"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[7px] font-black text-brand-purple uppercase tracking-widest mb-1 ml-1">Minutos</label>
                      <input
                        type="number"
                        required
                        className="w-full bg-brand-dark/5 border-b-2 border-brand-dark rounded-lg px-3 py-2 focus:outline-none focus:bg-brand-orange/5 transition-all font-bold text-[11px]"
                        value={formData.duracionMinutos}
                        onChange={(e) => setFormData({ ...formData, duracionMinutos: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-[7px] font-black text-brand-purple uppercase tracking-widest mb-1 ml-1">Precio ($)</label>
                      <input
                        type="number"
                        required
                        className="w-full bg-brand-dark/5 border-b-2 border-brand-dark rounded-lg px-3 py-2 focus:outline-none focus:bg-brand-orange/5 transition-all font-bold text-[11px]"
                        value={formData.precio}
                        onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-gray-100 text-gray-500 py-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-gray-200"
                    >
                      Cerrar
                    </button>
                    <button type="submit" className="flex-2 bg-brand-dark text-white px-4 py-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-[0_3px_0_0_#372673] hover:translate-y-0.5 active:shadow-none active:translate-y-1">
                      {editingService ? 'Guardar' : 'Crear'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {services.map(service => (
              <div key={service.id} className="bg-white p-2.5 md:p-3.5 rounded-[1.2rem] shadow-xl border-2 border-brand-dark flex items-center justify-between group hover:scale-[1.01] transition-all">
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <div className="min-w-0 w-full">
                    <h3 className="text-base font-black text-brand-dark uppercase tracking-tighter leading-tight break-words">{service.nombre}</h3>
                    <div className="flex items-center gap-2.5 mt-0.5 font-black text-[8px] uppercase tracking-widest overflow-hidden">
                      <span className="flex items-center gap-1 text-brand-purple shrink-0"><Clock size={9} /> {service.duracionMinutos}m</span>
                      <span className="flex items-center gap-1 text-green-600 shrink-0 bg-brand-dark/5 px-2 py-0.5 rounded-md border border-brand-dark/5"><DollarSign size={9} /> ${service.precio}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => handleEdit(service)} className="p-2 text-brand-dark hover:bg-brand-dark/10 rounded-lg transition-all" title="Editar">
                    <Save size={14} />
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Eliminar">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

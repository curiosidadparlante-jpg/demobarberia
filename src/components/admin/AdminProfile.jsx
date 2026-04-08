import React, { useState } from 'react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';
import { User, Save, Clock, Mail, Image as ImageIcon, Camera } from 'lucide-react';

export function AdminProfile() {
  const barber = JSON.parse(localStorage.getItem('barber') || '{}');
  const [formData, setFormData] = useState({
    nombre: barber.nombre || '',
    email: barber.email || '',
    horarioAtencionInicio: barber.horarioAtencionInicio || '09:00',
    horarioAtencionFin: barber.horarioAtencionFin || '19:00',
    imagenUrl: barber.imagenUrl || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("La imagen es muy pesada. Máximo 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imagenUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const updated = await api.updateProfile(formData);
      localStorage.setItem('barber', JSON.stringify(updated));
      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Mi Perfil" subtitle="Tus datos y horarios">
      <div className="flex flex-col md:flex-row gap-8 flex-1">
        {/* Profile Card Sidebar */}
        <div className="md:w-1/3 flex flex-col items-center">
          <label className="relative group cursor-pointer">
            <div className="w-48 h-48 rounded-[3rem] border-4 border-brand-dark overflow-hidden shadow-2xl group-hover:rotate-3 transition-transform bg-white/50 flex items-center justify-center">
              <img
                src={formData.imagenUrl || '/default_barber.png'}
                alt={formData.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-brand-orange text-white p-4 rounded-3xl shadow-lg border-4 border-brand-dark group-hover:scale-110 transition-transform">
              <Camera size={24} />
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          <div className="mt-12 text-center bg-brand-dark/5 p-6 rounded-3xl border-2 border-brand-dark/10 w-full border-dashed">
            <h3 className="text-xl font-black text-brand-dark uppercase tracking-tighter leading-none break-words">{formData.nombre}</h3>
            <p className="text-brand-orange text-[10px] font-black uppercase tracking-widest mt-2">{barber.role === 'OWNER' ? 'DUEÑO / ADMIN' : 'PELUQUERO'}</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 font-bold text-[10px] uppercase truncate">
              <Mail size={12} className="shrink-0" /> {formData.email}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="flex-1">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-[4px] border-brand-dark">
            {message.text && (
              <div className={`mb-6 p-4 rounded-2xl border-l-[6px] ${message.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
                <p className="text-xs font-black uppercase tracking-widest">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center space-x-2 text-brand-purple font-black text-[10px] uppercase tracking-[0.2em] mb-2 ml-1">
                  <User size={12} />
                  <span>Nombre Completo</span>
                </label>
                <input
                  type="text"
                  className="w-full bg-brand-dark/5 border-b-[4px] border-brand-dark rounded-xl px-4 py-3 focus:outline-none focus:bg-brand-orange/5 transition-all font-bold text-sm"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-brand-purple font-black text-[10px] uppercase tracking-[0.2em] mb-2 ml-1">
                  <Mail size={12} />
                  <span>Email de Acceso</span>
                </label>
                <input
                  type="email"
                  className="w-full bg-brand-dark/5 border-b-[4px] border-brand-dark rounded-xl px-4 py-3 focus:outline-none focus:bg-brand-orange/5 transition-all font-bold text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-2 text-brand-purple font-black text-[10px] uppercase tracking-[0.2em] mb-2 ml-1">
                    <Clock size={12} />
                    <span>Inicio Jornada</span>
                  </label>
                  <input
                    type="time"
                    className="w-full bg-brand-dark/5 border-b-[4px] border-brand-dark rounded-xl px-4 py-3 focus:outline-none focus:bg-brand-orange/5 transition-all font-bold text-sm"
                    value={formData.horarioAtencionInicio}
                    onChange={(e) => setFormData({ ...formData, horarioAtencionInicio: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-brand-purple font-black text-[10px] uppercase tracking-[0.2em] mb-2 ml-1">
                    <Clock size={12} />
                    <span>Fin Jornada</span>
                  </label>
                  <input
                    type="time"
                    className="w-full bg-brand-dark/5 border-b-[4px] border-brand-dark rounded-xl px-4 py-3 focus:outline-none focus:bg-brand-orange/5 transition-all font-bold text-sm"
                    value={formData.horarioAtencionFin}
                    onChange={(e) => setFormData({ ...formData, horarioAtencionFin: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center space-x-3 w-full md:w-auto px-10 py-5 bg-brand-dark text-brand-light text-sm font-black rounded-2xl uppercase tracking-[0.2em] shadow-[0_6px_0_0_#372673] hover:translate-y-0.5 active:shadow-none active:translate-y-1 transition-all ${loading ? 'opacity-50' : ''}`}
                >
                  <Save size={18} />
                  <span>{loading ? 'Guardando...' : 'Confirmar Cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

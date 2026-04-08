import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';
import { Users, Plus, Trash2, X, Mail, Shield, Clock, Pencil, Save } from 'lucide-react';

export function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    role: 'BARBER',
    horarioAtencionInicio: '09:00',
    horarioAtencionFin: '19:00',
    canEditServices: false
  });

  const loadStaff = async () => {
    try {
      const data = await api.getAdminStaff();
      setStaff(data);
    } catch (err) {
      setError('Error al cargar staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar a este peluquero? Se borrarán todos sus turnos.')) return;
    try {
      await api.deleteStaff(id);
      setStaff(staff.filter(s => s.id !== id));
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const togglePermission = async (id, currentPermission) => {
    try {
      await api.updateStaffPermissions(id, !currentPermission);
      setStaff(staff.map(m => m.id === id ? { ...m, canEditServices: !currentPermission } : m));
    } catch (err) {
      alert("Error al actualizar permisos");
    }
  };

  const handleEdit = (member) => {
    setFormData({
      nombre: member.nombre,
      email: member.email,
      password: '',
      role: member.role,
      horarioAtencionInicio: member.horarioAtencionInicio,
      horarioAtencionFin: member.horarioAtencionFin,
      canEditServices: member.canEditServices
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      role: 'BARBER',
      horarioAtencionInicio: '09:00',
      horarioAtencionFin: '19:00',
      canEditServices: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await api.updateStaff(editingId, formData);
        setStaff(staff.map(s => s.id === editingId ? updated : s));
      } else {
        const created = await api.createStaff(formData);
        setStaff([...staff, created]);
      }
      closeForm();
    } catch (err) {
      alert(editingId ? 'Error al actualizar peluquero' : 'Error al crear peluquero');
    }
  };

  return (
    <AdminLayout title="Staff" subtitle="Gestiona tu equipo">
      {loading ? (
        <div className="flex justify-center items-center flex-1 py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-orange"></div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 h-full">
          <header className="flex justify-between items-center mb-4 gap-2">
            <div>
              <h2 className="text-lg font-black text-brand-dark uppercase tracking-tighter">Equipo Estilo Cruz</h2>
              <p className="text-gray-500 font-bold text-[7px] uppercase tracking-[0.2em]">Activos: {staff.length}</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-brand-orange text-white px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-[0_3px_0_0_#8C4126] hover:translate-y-0.5 active:shadow-none active:translate-y-1 transition-all flex items-center gap-2 shrink-0"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Nuevo Peluquero</span>
            </button>
          </header>

          {showForm && (
            <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-2">
              <div className="bg-white rounded-[1.5rem] p-5 md:p-6 max-w-[320px] w-full shadow-2xl relative border-[3px] border-brand-dark max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-black text-brand-dark uppercase tracking-tighter">{editingId ? 'Editar Peluquero' : 'Nuevo Staff'}</h2>
                  <button onClick={closeForm} className="text-gray-400 hover:text-brand-orange transition-colors"><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[7px] font-black uppercase tracking-[0.2em] text-brand-purple mb-1 ml-1 block">Nombre Completo</label>
                      <input
                        type="text" required
                        className="w-full bg-brand-dark/5 border-b-2 border-brand-dark rounded-lg px-3 py-2 focus:outline-none focus:bg-brand-orange/5 transition-all font-bold text-[11px]"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[7px] font-black uppercase tracking-[0.2em] text-brand-purple mb-1 ml-1 block">Email Profesional</label>
                      <input
                        type="email" required
                        className="w-full bg-brand-dark/5 border-b-2 border-brand-dark rounded-lg px-3 py-2 focus:outline-none focus:bg-brand-orange/5 transition-all font-bold text-[11px]"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[7px] font-black uppercase tracking-[0.2em] text-brand-purple mb-1 ml-1 block">
                        {editingId ? 'Pass (vacío p/ no cambiar)' : 'Pass Temporal'}
                      </label>
                      <input
                        type="password" required={!editingId}
                        className="w-full bg-brand-dark/5 border-b-2 border-brand-dark rounded-lg px-3 py-2 focus:outline-none focus:bg-brand-orange/5 transition-all font-bold text-[11px]"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[7px] font-black uppercase tracking-[0.2em] text-brand-purple mb-1 ml-1 block">Inicio</label>
                        <input
                          type="time" required
                          className="w-full bg-brand-dark/5 border-b-2 border-brand-dark rounded-lg px-2 py-2 focus:outline-none font-bold text-[11px]"
                          value={formData.horarioAtencionInicio}
                          onChange={(e) => setFormData({ ...formData, horarioAtencionInicio: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[7px] font-black uppercase tracking-[0.2em] text-brand-purple mb-1 ml-1 block">Fin</label>
                        <input
                          type="time" required
                          className="w-full bg-brand-dark/5 border-b-2 border-brand-dark rounded-lg px-2 py-2 focus:outline-none font-bold text-[11px]"
                          value={formData.horarioAtencionFin}
                          onChange={(e) => setFormData({ ...formData, horarioAtencionFin: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[7px] font-black uppercase tracking-[0.2em] text-brand-purple mb-1 ml-1 block">Rol</label>
                      <select
                        className="w-full bg-brand-dark/5 border-b-2 border-brand-dark rounded-lg px-3 py-2 focus:outline-none focus:bg-brand-orange/5 font-black uppercase tracking-widest text-[9px] cursor-pointer"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="BARBER">Staff</option>
                        <option value="OWNER">Dueño</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 px-2 py-1.5 cursor-pointer group bg-brand-dark/5 rounded-lg border border-dashed border-brand-dark/20 hover:bg-brand-orange/5 transition-all">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 accent-brand-orange"
                        checked={formData.canEditServices}
                        onChange={(e) => setFormData({ ...formData, canEditServices: e.target.checked })}
                      />
                      <span className="text-[8px] font-black uppercase tracking-widest text-brand-dark group-hover:text-brand-orange leading-tight">Editar servicios</span>
                    </label>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="flex-1 bg-gray-100 text-gray-500 py-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-gray-200"
                    >
                      Cerrar
                    </button>
                    <button type="submit" className="flex-[2] bg-brand-dark text-white px-4 py-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-[0_3px_0_0_#372673] hover:translate-y-0.5 active:shadow-none active:translate-y-1 flex items-center justify-center gap-2">
                      <Save size={14} />
                      <span>{editingId ? 'Guardar' : 'Crear'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid gap-6">
            {staff.map(member => (
              <div key={member.id} className="bg-white p-3 md:p-4 rounded-[1.5rem] shadow-xl border-2 border-brand-dark flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:scale-[1.01] transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                  {member.role === 'OWNER' ? <Shield size={60} /> : <Users size={60} />}
                </div>

                <div className="flex-1 relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl border-2 shadow-md group-hover:rotate-6 transition-all shrink-0 flex items-center justify-center overflow-hidden ${member.role === 'OWNER' ? 'bg-brand-dark text-brand-orange border-brand-orange' : 'bg-white text-brand-purple border-brand-purple/20'}`}>
                      {member.imagenUrl ? (
                        <img src={member.imagenUrl} className="w-full h-full object-cover" alt={member.nombre} />
                      ) : (
                        member.role === 'OWNER' ? <Shield size={18} /> : <Users size={18} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-base font-black text-brand-dark uppercase tracking-tighter leading-tight truncate">{member.nombre}</h3>
                          <div className="flex flex-col gap-0.5 mt-0.5 opacity-60">
                            <span className="flex items-center gap-1.5 text-gray-500 font-bold text-[8px] uppercase tracking-widest leading-none truncate"><Mail size={8} className="shrink-0" /> {member.email}</span>
                            <span className="flex items-center gap-1.5 text-brand-orange font-black text-[8px] uppercase tracking-widest leading-none"><Clock size={8} className="shrink-0" /> {member.horarioAtencionInicio} - {member.horarioAtencionFin}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleEdit(member)}
                            className="p-2 bg-brand-dark/5 text-brand-dark hover:bg-brand-dark hover:text-white rounded-lg transition-all border border-transparent hover:shadow-md active:scale-95"
                            title="Editar Peluquero"
                          >
                            <Pencil size={12} />
                          </button>
                          {member.role !== 'OWNER' && (
                            <button
                              onClick={() => handleDelete(member.id)}
                              className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-transparent hover:shadow-md active:scale-95"
                              title="Eliminar Peluquero"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {member.role !== 'OWNER' && (
                    <div className="mt-3 pt-3 border-t-2 border-dashed border-gray-100 flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer group bg-brand-dark/5 px-2 py-1 rounded-lg hover:bg-brand-orange/5 transition-all">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 accent-brand-orange"
                          checked={member.canEditServices}
                          onChange={() => togglePermission(member.id, member.canEditServices)}
                        />
                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-dark group-hover:text-brand-orange transition-all leading-none">Permiso Editar</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';
import { Settings, Save, Building, Phone, Image as ImageIcon } from 'lucide-react';

export function GlobalSettings() {
  const [formData, setFormData] = useState({
    nombreLocal: '',
    logoUrl: '',
    telefonoContacto: '',
    diasAbiertos: '1,2,3,4,5,6'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const diasSemana = [
    { id: 0, label: 'Dom' },
    { id: 1, label: 'Lun' },
    { id: 2, label: 'Mar' },
    { id: 3, label: 'Mié' },
    { id: 4, label: 'Jue' },
    { id: 5, label: 'Vie' },
    { id: 6, label: 'Sáb' }
  ];

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await api.getConfig();
        if (config) {
          setFormData({
            nombreLocal: config.nombreLocal || 'Estilo Cruz',
            logoUrl: config.logoUrl || '/logo.png',
            telefonoContacto: config.telefonoContacto || '+54 9 11 3414-1804',
            diasAbiertos: config.diasAbiertos || '1,2,3,4,5,6'
          });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Error al cargar la configuración actual' });
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  const toggleDia = (id) => {
    const currentDias = formData.diasAbiertos.split(',').filter(d => d !== '');
    let newDias;
    if (currentDias.includes(id.toString())) {
      newDias = currentDias.filter(d => d !== id.toString());
    } else {
      newDias = [...currentDias, id.toString()].sort();
    }
    setFormData({ ...formData, diasAbiertos: newDias.join(',') });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("La imagen es muy pesada. Máximo 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.updateConfig(formData);
      setMessage({ type: 'success', text: 'Configuración actualizada exitosamente' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al actualizar configuración' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Configuración" subtitle="Ajustes de marca">
      <div className="max-w-2xl mx-auto flex-1">
        {/* Edit Form */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border-[4px] border-brand-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Settings size={120} className="text-brand-dark" />
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-2xl border-l-[6px] relative z-10 ${message.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
              <p className="text-xs font-black uppercase tracking-widest">{message.text}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center p-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-orange"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div>
                <label className="flex items-center space-x-2 text-brand-purple font-black text-[10px] uppercase tracking-[0.2em] mb-2 ml-1">
                  <Building size={12} />
                  <span>Nombre del Local</span>
                </label>
                <input
                  type="text"
                  className="w-full bg-brand-dark/5 border-b-[4px] border-brand-dark rounded-xl px-4 py-3 focus:outline-none focus:bg-brand-orange/5 transition-all font-bold text-sm"
                  value={formData.nombreLocal}
                  onChange={(e) => setFormData({ ...formData, nombreLocal: e.target.value })}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-brand-purple font-black text-[10px] uppercase tracking-[0.2em] mb-2 ml-1">
                  <ImageIcon size={12} />
                  <span>Logo de la Marca</span>
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="bg-brand-dark rounded-full p-2 border-2 border-brand-orange shadow-lg shrink-0 overflow-hidden w-20 h-20 flex items-center justify-center bg-white/50">
                    <img src={formData.logoUrl || '/logo.png'} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                  <label className="flex-1 w-full flex items-center justify-center gap-2 bg-brand-dark/5 border-2 border-dashed border-brand-dark/20 rounded-xl px-4 py-3 cursor-pointer hover:bg-brand-dark/10 transition-all">
                    <ImageIcon size={16} className="text-brand-orange" />
                    <span className="text-xs font-black uppercase tracking-widest text-brand-dark">Cambiar Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-brand-purple font-black text-[10px] uppercase tracking-[0.2em] mb-2 ml-1">
                  <Phone size={12} />
                  <span>WhatsApp de Contacto</span>
                </label>
                <input
                  type="text"
                  className="w-full bg-brand-dark/5 border-b-[4px] border-brand-dark rounded-xl px-4 py-3 focus:outline-none focus:bg-brand-orange/5 transition-all font-bold text-sm"
                  value={formData.telefonoContacto}
                  onChange={(e) => setFormData({ ...formData, telefonoContacto: e.target.value })}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-brand-purple font-black text-[10px] uppercase tracking-[0.2em] mb-3 ml-1">
                  <Settings size={12} />
                  <span>Días Abiertos</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {diasSemana.map((dia) => {
                    const active = formData.diasAbiertos.split(',').includes(dia.id.toString());
                    return (
                      <button
                        key={dia.id}
                        type="button"
                        onClick={() => toggleDia(dia.id)}
                        className={`flex-1 min-w-[60px] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-b-4
                          ${active 
                            ? 'bg-brand-orange text-white border-brand-dark/30 shadow-lg translate-y-0.5' 
                            : 'bg-brand-dark/5 text-brand-dark border-transparent hover:bg-brand-dark/10'}`}
                      >
                        {dia.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex items-center justify-center space-x-3 w-full px-10 py-5 bg-brand-dark text-brand-light text-sm font-black rounded-2xl uppercase tracking-[0.2em] shadow-[0_6px_0_0_#372673] hover:translate-y-0.5 active:shadow-none active:translate-y-1 transition-all ${saving ? 'opacity-50' : ''}`}
                >
                  <Save size={18} />
                  <span>{saving ? 'Guardando...' : 'Confirmar'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

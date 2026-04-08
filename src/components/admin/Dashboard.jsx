import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';
import { Calendar, CheckCircle, XCircle, Clock, Phone, User, Scissors, Ban, Trash2, Plus } from 'lucide-react';

export function Dashboard() {
  const [turnos, setTurnos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTurnos, setSelectedTurnos] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockForm, setBlockForm] = useState({ horaInicio: '', horaFin: '', motivo: '' });
  const dateInputRef = useRef(null);

  const loadTurnos = async () => {
    setLoading(true);
    try {
      const data = await api.fetchAdminTurnos(selectedDate);
      setTurnos(data);
      setSelectedTurnos([]);
    } catch (err) {
      setError('Error al cargar los turnos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTurnos();
    loadBloques();
  }, [selectedDate]);

  const loadBloques = async () => {
    try {
      const data = await api.getBlocks(selectedDate);
      setBloques(data);
    } catch (err) {
      console.error('Error loading blocks', err);
    }
  };

  const handleConfirmar = async (turnoId) => {
    if (!window.confirm('¿Confirmar que el cliente asistió al turno?')) return;
    try {
      await api.updateTurnoStatus(turnoId, 'ASISTIO');
      loadTurnos();
    } catch (err) {
      alert('Error al confirmar turno');
    }
  };

  const handleCancelar = async (turnoId) => {
    if (!window.confirm('¿Seguro que deseas cancelar y eliminar este turno?')) return;
    try {
      await api.deleteTurno(turnoId);
      loadTurnos();
    } catch (err) {
      alert('Error al cancelar turno');
    }
  };

  const toggleSelection = (turnoId) => {
    setSelectedTurnos(prev => 
      prev.includes(turnoId) ? prev.filter(id => id !== turnoId) : [...prev, turnoId]
    );
  };

  const handleBulkConfirmar = async () => {
    if (!window.confirm(`¿Confirmar asistencia de ${selectedTurnos.length} clientes?`)) return;
    try {
      setLoading(true);
      await Promise.all(selectedTurnos.map(id => api.updateTurnoStatus(id, 'ASISTIO')));
      await loadTurnos();
    } catch (err) {
      alert('Error en confirmación masiva');
      setLoading(false);
    }
  };

  const handleBulkCancelar = async () => {
    if (!window.confirm(`¿Cancelar y eliminar ${selectedTurnos.length} turnos?`)) return;
    try {
      setLoading(true);
      await Promise.all(selectedTurnos.map(id => api.deleteTurno(id)));
      await loadTurnos();
    } catch (err) {
      alert('Error en cancelación masiva');
      setLoading(false);
    }
  };

  const handleCreateBlock = async (e) => {
    e.preventDefault();
    if (!blockForm.horaInicio || !blockForm.horaFin) return alert('Seleccioná hora inicio y fin');
    if (blockForm.horaInicio >= blockForm.horaFin) return alert('La hora de inicio debe ser anterior a la de fin');
    try {
      await api.createBlock({ fecha: selectedDate, ...blockForm });
      setShowBlockModal(false);
      setBlockForm({ horaInicio: '', horaFin: '', motivo: '' });
      loadBloques();
    } catch (err) {
      alert('Error al crear bloqueo');
    }
  };

  const handleDeleteBlock = async (id) => {
    if (!window.confirm('¿Eliminar este bloqueo?')) return;
    try {
      await api.deleteBlock(id);
      loadBloques();
    } catch (err) {
      alert('Error al eliminar bloqueo');
    }
  };

  const handlePickerOpen = (e) => {
    e.preventDefault();
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.click();
      }
    }
  };

  const CustomHeader = (
    <div className="flex items-center gap-2">
      <span className="font-black">Agenda: {format(new Date(selectedDate + 'T12:00:00'), 'dd/MM')}</span>
      <button 
        onClick={handlePickerOpen}
        className="p-1 px-2 hover:bg-brand-dark/10 rounded-lg transition-all flex items-center justify-center text-brand-dark group"
        title="Elegir Fecha"
      >
        <Calendar size={18} className="group-hover:text-brand-orange transition-colors" />
        <input 
          ref={dateInputRef}
          type="date" 
          className="sr-only" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </button>
    </div>
  );

  return (
    <AdminLayout 
      title={CustomHeader} 
      subtitle="Gestión de Citas"
      extraNav={
        <button
          onClick={() => setShowBlockModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-brand-dark/5 text-brand-dark/60 hover:bg-brand-dark/10 transition-all"
          title="Restringir horario"
        >
          <Ban size={14} />
          <span className="hidden sm:inline">Restringir horario</span>
        </button>
      }
    >
        {loading ? (
          <div className="flex justify-center items-center flex-1 py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-orange"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl border-l-[6px] border-red-500 font-bold">
            {error}
          </div>
        ) : turnos.length === 0 && bloques.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-brand-dark/5 rounded-3xl border-4 border-dashed border-gray-300">
            <Calendar size={64} className="text-gray-300 mb-6" />
            <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tighter mb-2">Sin Turnos</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] max-w-xs">No hay citas para el {format(new Date(selectedDate + 'T12:00:00'), 'dd/MM')}.</p>
          </div>
        ) : (
          <div className="space-y-4 pb-20">
            {/* EXISTING BLOCKS */}
            {bloques.length > 0 && (
              <div className="space-y-2">
                <p className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1"><Ban size={10}/> Horarios Bloqueados</p>
                {bloques.map(b => (
                  <div key={b.id} className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-500 text-white px-2 py-1 rounded-lg font-black text-xs">
                        {b.horaInicio} – {b.horaFin}
                      </div>
                      {b.motivo && <span className="text-red-700 font-bold text-xs truncate">{b.motivo}</span>}
                    </div>
                    <button onClick={() => handleDeleteBlock(b.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all" title="Eliminar bloqueo">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {turnos.map((turno) => {
              const isSelected = selectedTurnos.includes(turno.id);
              const isSelectable = turno.estado !== 'ASISTIO';
              
              return (
              <div 
                key={turno.id} 
                onClick={() => isSelectable && toggleSelection(turno.id)}
                className={`p-4 md:p-6 rounded-[2rem] shadow-xl border-[3px] flex flex-col md:flex-row md:items-center justify-between gap-4 group transition-all relative overflow-hidden ${
                  isSelected 
                    ? 'bg-brand-orange/10 border-brand-orange scale-[1.02] ring-4 ring-brand-orange/30 shadow-[0_10px_30px_-10px_rgba(255,87,34,0.4)]' 
                    : isSelectable 
                      ? 'bg-white border-brand-dark hover:scale-[1.01] cursor-pointer' 
                      : 'bg-gray-50 border-gray-300 opacity-80 cursor-default'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-brand-orange text-white rounded-bl-3xl px-4 py-2 font-black text-[9px] uppercase tracking-widest shadow-lg z-10 flex items-center gap-1">
                    <CheckCircle size={10} /> Elegido
                  </div>
                )}
                
                <div className="flex items-center space-x-6 relative z-10">
                  <div className={`text-center p-2 rounded-xl w-20 border-b-[4px] shadow-lg flex-shrink-0 transition-colors ${isSelected ? 'bg-brand-orange text-white border-brand-dark' : 'bg-brand-dark text-brand-light border-brand-orange'}`}>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-80 flex items-center justify-center gap-1">
                      <Clock size={8} /> Hora
                    </p>
                    <p className="text-lg font-black leading-tight mt-0.5">{turno.horaInicio}</p>
                  </div>
                  
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                       <h3 className={`text-base font-black uppercase leading-none truncate break-words transition-colors ${isSelected ? 'text-brand-orange' : 'text-brand-dark'}`}>{turno.clienteNombre}</h3>
                       <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full border shrink-0 transition-colors ${
                         turno.estado === 'ASISTIO' 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : isSelected
                            ? 'bg-white text-brand-orange border-brand-orange/30'
                            : 'bg-brand-orange/10 text-brand-orange border-brand-orange/20'
                       }`}>
                         {turno.estado || 'CONF'}
                       </span>
                    </div>
                    <p className="text-brand-purple font-black text-[9px] tracking-widest uppercase flex items-center gap-1 truncate break-words mt-0.5 opacity-80">
                       {turno.servicio.nombre}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 font-bold text-[8px] uppercase tracking-wider overflow-hidden mt-0.5">
                       <a 
                         href={`https://wa.me/54${turno.clienteTelefono}`} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         onClick={(e) => e.stopPropagation()}
                         className={`flex items-center gap-1 shrink-0 hover:scale-105 transition-all px-1.5 py-0.5 rounded-md border ${isSelected ? 'bg-white text-green-600 border-green-600/20' : 'bg-brand-dark/5 hover:text-green-600 border-brand-dark/5'}`}
                         title="WhatsApp"
                       >
                         <Phone size={8} className={isSelected ? "" : "text-green-600"} /> {turno.clienteTelefono}
                       </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 pt-3 md:pt-0 border-t md:border-t-0 border-brand-dark/5 relative z-10">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleConfirmar(turno.id); }}
                    disabled={turno.estado === 'ASISTIO'}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${
                      turno.estado === 'ASISTIO' 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' 
                        : 'bg-brand-dark text-white shadow-[0_3px_0_0_#372673] hover:translate-y-0.5 active:shadow-none active:translate-y-1'
                    }`}
                  >
                    <CheckCircle size={14} /> <span className="md:hidden">Asistió</span>
                  </button>
                  {turno.estado !== 'ASISTIO' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCancelar(turno.id); }}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-red-500 text-white px-3 py-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-[0_3px_0_0_#991b1b] hover:translate-y-0.5 active:shadow-none active:translate-y-1 transition-all"
                    >
                      <XCircle size={14} /> <span className="md:hidden">Cancelar</span>
                    </button>
                  )}
                </div>
              </div>
            )})}
            
            {/* FLOATING ACTION BAR FOR BULK ACTIONS */}
            {selectedTurnos.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border-[4px] border-brand-dark z-50 flex items-center gap-3 md:gap-4 animate-fade-in-up">
                 <div className="bg-brand-dark text-white px-4 py-3 rounded-xl flex flex-col items-center justify-center leading-none shadow-inner border-b-2 border-brand-orange">
                   <span className="text-xl font-black mb-1">{selectedTurnos.length}</span>
                   <span className="text-[7px] uppercase tracking-[0.2em] font-bold text-gray-300">Sel.</span>
                 </div>
                 <div className="flex gap-2 pr-2">
                   <button 
                     onClick={handleBulkConfirmar} 
                     className="bg-green-500 text-white px-3 md:px-5 py-3 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-[0_4px_0_0_#166534] active:translate-y-1 active:shadow-none flex items-center gap-1.5"
                   >
                     <CheckCircle size={16}/> <span>Confirmar</span>
                   </button>
                   <button 
                     onClick={handleBulkCancelar} 
                     className="bg-red-500 text-white px-3 md:px-5 py-3 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-[0_4px_0_0_#991b1b] active:translate-y-1 active:shadow-none flex items-center gap-1.5"
                   >
                     <XCircle size={16}/> <span className="hidden sm:inline">Eliminar</span>
                   </button>
                 </div>
              </div>
            )}
          </div>
        )}

        {/* BLOCK MODAL */}
        {showBlockModal && (
          <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-2">
            <div className="bg-white rounded-[1.5rem] p-5 max-w-[320px] w-full shadow-2xl border-[3px] border-brand-purple/20">
              <h2 className="text-lg font-black text-brand-dark uppercase tracking-tighter mb-4 flex items-center gap-2"><Ban size={18}/> Restringir Horario</h2>
              <form onSubmit={handleCreateBlock} className="space-y-3">
                <div>
                  <label className="block text-[7px] font-black text-brand-purple uppercase tracking-widest mb-1 ml-1">Fecha</label>
                  <input type="text" readOnly value={format(new Date(selectedDate + 'T12:00:00'), 'dd/MM/yyyy')} className="w-full bg-brand-dark/5 border-b-2 border-brand-dark rounded-lg px-3 py-2 font-bold text-[11px] text-brand-dark/60" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[7px] font-black text-brand-purple uppercase tracking-widest mb-1 ml-1">Desde</label>
                    <input type="time" required value={blockForm.horaInicio} onChange={(e) => setBlockForm({...blockForm, horaInicio: e.target.value})} className="w-full bg-brand-dark/5 border-b-2 border-brand-dark rounded-lg px-3 py-2 font-bold text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-[7px] font-black text-brand-purple uppercase tracking-widest mb-1 ml-1">Hasta</label>
                    <input type="time" required value={blockForm.horaFin} onChange={(e) => setBlockForm({...blockForm, horaFin: e.target.value})} className="w-full bg-brand-dark/5 border-b-2 border-brand-dark rounded-lg px-3 py-2 font-bold text-[11px]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[7px] font-black text-brand-purple uppercase tracking-widest mb-1 ml-1">Motivo (opcional)</label>
                  <input type="text" placeholder="Ej: Turno médico" value={blockForm.motivo} onChange={(e) => setBlockForm({...blockForm, motivo: e.target.value})} className="w-full bg-brand-dark/5 border-b-2 border-brand-dark rounded-lg px-3 py-2 font-bold text-[11px]" />
                </div>
                <div className="pt-2 flex gap-2">
                  <button type="button" onClick={() => setShowBlockModal(false)} className="flex-1 bg-gray-100 text-gray-500 py-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-gray-200">Cerrar</button>
                  <button type="submit" className="flex-1 bg-brand-dark text-white py-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-[0_3px_0_0_#000] hover:translate-y-0.5 active:shadow-none active:translate-y-1 flex items-center justify-center gap-1.5">Restringir</button>
                </div>
              </form>
            </div>
          </div>
        )}
    </AdminLayout>
  );
}

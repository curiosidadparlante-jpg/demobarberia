import React from 'react';

export function TimeSelector({ availableSlots, selectedSlot, onSelectSlot }) {
  if (!availableSlots || availableSlots.length === 0) {
    return (
      <div className="text-center p-6 bg-white/50 rounded-2xl border-[3px] border-dashed border-brand-orange animate-fade-in-up">
        <p className="font-bold text-lg text-brand-dark font-display">No hay turnos para esta fecha.</p>
        <p className="text-sm mt-1 font-bold text-brand-orange">Probá con otro día o servicio más corto.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-6 animate-fade-in-up">
      <h2 className="text-xl font-black text-brand-dark tracking-tight border-b-[3px] border-brand-dark pb-1 inline-block">3. Elegí tu horario</h2>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2 pt-1">
        {availableSlots.map((slot) => {
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              onClick={() => onSelectSlot(slot)}
              className={`
                py-2 rounded-xl font-display font-black text-base border-[3px] border-b-[4px] transition-all active:scale-95
                ${isSelected 
                  ? 'bg-brand-orange border-brand-dark text-white shadow-lg scale-105' 
                  : 'bg-white border-brand-purple text-brand-dark shadow hover:-translate-y-0.5 hover:border-brand-dark'}
              `}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}

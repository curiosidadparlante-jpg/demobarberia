import React from 'react';
import { Clock } from 'lucide-react';

export function ServiceSelector({ services, selectedService, onSelectService }) {
  return (
    <div className="space-y-3 mb-4 animate-fade-in-up">
      <h2 className="text-xl font-black text-brand-dark tracking-tight border-b-[3px] border-brand-dark pb-1 inline-block">2. ¿Qué hacemos?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id;
          return (
            <button
              key={service.id}
              onClick={() => onSelectService(service)}
              className={`
                flex items-center justify-between md:flex-col md:items-start p-4 rounded-xl border-[3px] text-left border-b-[6px]
                transition-all active:scale-95 gap-3
                ${isSelected
                  ? 'border-brand-dark bg-brand-orange text-white scale-[1.02] shadow-lg'
                  : 'border-brand-purple bg-white hover:border-brand-dark hover:-translate-y-0.5 text-brand-dark shadow'}
              `}
            >
              <div className="min-w-0 flex-1 w-full">
                <h3 className="font-display text-lg font-black leading-tight break-words">{service.nombre || service.name}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <div className={`flex items-center gap-1 text-xs font-bold ${isSelected ? 'text-white/80' : 'text-brand-purple'}`}>
                    <Clock className="w-3.5 h-3.5 shrink-0" /> {service.duracionMinutos || service.duracion_minutos} min
                  </div>
                  {/* In desktop, price moves here */}
                  <div className="hidden md:block font-display text-lg font-black bg-white/20 px-3 py-0.5 rounded-lg border-2 border-white/10 shrink-0">
                    ${service.precio}
                  </div>
                </div>
              </div>
              {/* In mobile, price is on the right */}
              <div className="md:hidden font-display text-xl font-black bg-white/20 px-3 py-1 rounded-xl shrink-0 border-2 border-white/10">
                ${service.precio}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

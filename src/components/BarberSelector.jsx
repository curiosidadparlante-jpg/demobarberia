import React from 'react';

export function BarberSelector({ barbers, selectedBarber, onSelectBarber }) {
  return (
    <div className="space-y-3 mb-4 animate-fade-in-up">
      <h2 className="text-xl font-black text-brand-dark tracking-tight border-b-[3px] border-brand-dark pb-1 inline-block">3. ¿Con quién te cortás?</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {barbers.map((barber) => {
          const isSelected = selectedBarber?.id === barber.id;
          return (
            <button
              key={barber.id}
              onClick={() => onSelectBarber(isSelected ? null : barber)}
              className={`
                flex flex-col items-center p-2 rounded-xl border-[3px] transition-all active:scale-95 text-center
                ${isSelected 
                  ? 'border-brand-dark bg-brand-orange text-white shadow-lg scale-105 z-10' 
                  : 'border-brand-purple bg-white hover:border-brand-dark text-brand-dark shadow'}
              `}
            >
              <div className="relative mb-2">
                <img 
                  src={barber.imagenUrl || barber.image || '/default_barber.png'} 
                  alt={barber.nombre || barber.name} 
                  className={`w-16 h-16 rounded-lg object-cover border-2 ${isSelected ? 'border-white' : 'border-brand-purple'}`}
                />
                {isSelected && (
                  <div className="absolute -top-1 -right-1 bg-brand-dark text-white rounded-full p-0.5 border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <span className="font-display font-black text-sm uppercase tracking-tight line-clamp-1">
                {barber.nombre || barber.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

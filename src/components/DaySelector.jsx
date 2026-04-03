import React from 'react';
import { addDays, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

export function DaySelector({ selectedDate, onSelectDate, diasAbiertos = '1,2,3,4,5,6' }) {
  const dates = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));
  const openDays = diasAbiertos.split(',').map(Number);

  return (
    <div className="space-y-2 mb-4">
      <h2 className="text-xl font-black text-brand-dark tracking-tight border-b-[3px] border-brand-dark pb-1 inline-block">1. ¿Cuándo venís?</h2>
      <div className="flex md:grid md:grid-cols-7 gap-3 overflow-x-auto md:overflow-x-visible pb-2 pt-1 snap-x hide-scrollbar">
        {dates.map((date) => {
          const dayIndex = date.getDay();
          const isOpen = openDays.includes(dayIndex);
          const isSelected = selectedDate && isSameDay(date, selectedDate);

          return (
            <button
              key={date.toString()}
              onClick={() => isOpen && onSelectDate(date)}
              disabled={!isOpen}
              className={`
                flex flex-col items-center justify-center min-w-[70px] md:min-w-0 h-[80px] snap-center rounded-[14px]
                transition-all duration-300 transform active:scale-95 border-b-[6px] 
                ${!isOpen 
                  ? 'bg-gray-100 border-gray-300 text-gray-400 opacity-50 cursor-not-allowed' 
                  : isSelected 
                    ? 'bg-brand-orange border-brand-dark text-white scale-105 shadow-lg' 
                    : 'bg-white border-brand-purple text-brand-dark shadow hover:-translate-y-0.5 hover:border-brand-dark'}
              `}
            >
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                {format(date, 'eee', { locale: es })}
              </span>
              <span className="text-2xl font-display mt-0.5 font-black">
                {format(date, 'd')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

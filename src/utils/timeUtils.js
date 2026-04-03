import { parse, addMinutes, isBefore, isAfter, isEqual, format } from 'date-fns';

/**
 * Parses a time string "HH:mm" to a Date object on a reference date (today)
 */
export const parseTime = (timeStr) => parse(timeStr, 'HH:mm', new Date());

/**
 * Calcula los bloques horarios disponibles para un servicio en un día específico.
 * 
 * @param {Object} horarioAtencion - { inicio: "09:00", fin: "19:00" }
 * @param {Array} turnosOcupados - Array de objetos { hora_inicio: "10:00", hora_fin: "10:30" }
 * @param {Number} duracionServicioMinutos - ej: 45
 * @returns {Array} Array de strings con las horas de inicio disponibles, ej: ["09:00", "09:45", ...]
 */
export function calculateAvailableSlots(horarioAtencion, turnosOcupados, duracionServicioMinutos) {
  const slots = [];
  
  let currentStartTime = parseTime(horarioAtencion.inicio);
  const endTime = parseTime(horarioAtencion.fin);
  
  // Convertir turnos a Date objects para fácil comparación
  const occupiedIntervals = turnosOcupados.map(t => ({
    start: parseTime(t.hora_inicio),
    end: parseTime(t.hora_fin)
  }));

  // Ordenamos los turnos por hora de inicio por seguridad
  occupiedIntervals.sort((a, b) => a.start - b.start);

  while (isBefore(currentStartTime, endTime)) {
    const nextPotentialEnd = addMinutes(currentStartTime, duracionServicioMinutos);
    
    // Si el fin potencial supera el fin de atención, no hay más turnos hoy
    if (isAfter(nextPotentialEnd, endTime)) {
      break;
    }
    
    // Verificamos si este bloque choca con algún turno ocupado
    let hasConflict = false;
    for (const interval of occupiedIntervals) {
      // Un conflicto ocurre si el bloque propuesto se superpone con un turno.
      // Superposición: start1 < end2 AND start2 < end1
      if (isBefore(currentStartTime, interval.end) && isBefore(interval.start, nextPotentialEnd)) {
        hasConflict = true;
        // Si hay conflicto, adelantamos el "currentStartTime" al fin de este turno
        currentStartTime = interval.end;
        break; // Volvemos a empezar el loop `while` desde esta nueva hora
      }
    }
    
    // Si no hubo conflicto, es un bloque válido!
    if (!hasConflict) {
      slots.push(format(currentStartTime, 'HH:mm'));
      // Adelantamos la hora actual una duración del servicio
      currentStartTime = nextPotentialEnd;
    }
  }

  return slots;
}

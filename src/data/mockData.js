import { addDays, format, setHours, setMinutes } from 'date-fns';

export const mockServices = [
  { id: 's1', name: 'Corte Clásico', duracion_minutos: 30, precio: 5000 },
  { id: 's2', name: 'Corte + Barba', duracion_minutos: 45, precio: 7500 },
  { id: 's3', name: 'Perfilado de Barba', duracion_minutos: 15, precio: 3000 },
  { id: 's4', name: 'Color y Decoloración', duracion_minutos: 120, precio: 15000 }
];

export const mockProfesionales = [
  { id: 'p1', name: 'Facundo', image: '/barber_facundo.png', horario_atencion: { inicio: '09:00', fin: '19:00' } },
  { id: 'p2', name: 'Nico', image: '/barber_nico.png', horario_atencion: { inicio: '09:00', fin: '19:00' } },
  { id: 'p3', name: 'Mateo', image: '/barber_mateo.png', horario_atencion: { inicio: '10:00', fin: '20:00' } },
  { id: 'p4', name: 'Santi', image: '/barber_santi.png', horario_atencion: { inicio: '09:00', fin: '18:00' } }
];

// Generamos algunos turnos ocupados para hoy y mañana a modo de ejemplo
const today = new Date();
const tomorrow = addDays(today, 1);

export const mockTurnosOcupados = [
  {
    id: 't1',
    profesional_id: 'p1',
    servicio_id: 's1',
    fecha: format(today, 'yyyy-MM-dd'),
    hora_inicio: '10:00',
    hora_fin: '10:30'
  },
  {
    id: 't2',
    profesional_id: 'p1',
    servicio_id: 's2',
    fecha: format(today, 'yyyy-MM-dd'),
    hora_inicio: '11:00',
    hora_fin: '11:45'
  },
  {
    id: 't3',
    profesional_id: 'p1',
    servicio_id: 's4',
    fecha: format(tomorrow, 'yyyy-MM-dd'),
    hora_inicio: '14:00',
    hora_fin: '16:00'
  }
];

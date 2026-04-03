import { mockServices, mockProfesionales, mockTurnosOcupados } from '../data/mockData';

/**
 * API DEMO — Todos los datos son locales / hardcodeados.
 * No requiere backend ni variables de entorno.
 */

// Persist bookings in localStorage so they survive page refresh during the demo
const BOOKINGS_KEY = 'demo_bookings';

function getSavedBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveBooking(booking) {
  const bookings = getSavedBookings();
  bookings.push(booking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export const api = {
  getServices: async () => {
    return [...mockServices];
  },

  getProfessionals: async () => {
    return [...mockProfesionales];
  },

  checkClientByPhone: async (phone) => {
    // Simulate: phone "1555555555" is a known client
    const knownClients = {
      '1555555555': 'Juan Pérez',
      '1544444444': 'María López',
    };
    await new Promise(r => setTimeout(r, 500)); // Simular latencia
    return knownClients[phone] || null;
  },

  getConfig: async () => {
    return {
      nombreLocal: 'Tu Barbería',
      logoUrl: '/logo.png',
      telefonoContacto: '+54 9 11 3414-1804',
      diasAbiertos: '1,2,3,4,5,6',
    };
  },

  async fetchAvailability(fecha, servicioId, profesionalId) {
    // Combine hardcoded mock + localStorage bookings
    const savedBookings = getSavedBookings();
    const allBookings = [...mockTurnosOcupados, ...savedBookings];

    const turnosDelDia = allBookings.filter(
      t => t.fecha === fecha && (t.profesional_id === profesionalId || t.profesionalId === profesionalId)
    );

    const servicio = mockServices.find(s => s.id === servicioId);
    const profesional = mockProfesionales.find(p => p.id === profesionalId);

    if (!servicio || !profesional) return { slots: [] };

    const { calculateAvailableSlots } = await import('../utils/timeUtils');
    const horario = profesional.horario_atencion;
    const duracion = servicio.duracion_minutos;

    const slots = calculateAvailableSlots(horario, turnosDelDia, duracion);
    return { slots };
  },

  async createTurno(turnoData) {
    await new Promise(r => setTimeout(r, 600)); // Simular latencia

    const servicio = mockServices.find(s => s.id === turnoData.servicioId);
    const duracion = servicio ? servicio.duracion_minutos : 30;

    // Calculate end time
    const [h, m] = turnoData.horaInicio.split(':').map(Number);
    const endMinutes = h * 60 + m + duracion;
    const endH = String(Math.floor(endMinutes / 60)).padStart(2, '0');
    const endM = String(endMinutes % 60).padStart(2, '0');

    const newBooking = {
      id: `demo_${Date.now()}`,
      profesional_id: turnoData.profesionalId,
      servicio_id: turnoData.servicioId,
      fecha: turnoData.fecha,
      hora_inicio: turnoData.horaInicio,
      hora_fin: `${endH}:${endM}`,
      clienteNombre: turnoData.clienteNombre,
      clienteTelefono: turnoData.clienteTelefono,
    };

    saveBooking(newBooking);
    return { ok: true, turno: newBooking };
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('barber');
  }
};

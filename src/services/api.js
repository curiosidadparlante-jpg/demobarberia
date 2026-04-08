import { mockServices, mockProfesionales, mockTurnosOcupados } from '../data/mockData';

/**
 * API DEMO — Todos los datos son locales / hardcodeados.
 * No requiere backend ni variables de entorno.
 */

// Claves de localStorage para persistir datos de la demo
const KEY_BOOKINGS = 'demo_bookings';
const KEY_SERVICES = 'demo_services';
const KEY_STAFF = 'demo_staff';
const KEY_CONFIG = 'demo_config';
const KEY_BLOCKS = 'demo_blocks';

// Helper functions para obtener y guardar datos simulados
function getData(key, defaultData) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultData;
  } catch {
    return defaultData;
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const api = {
  // ── PÚBLICOS ──
  getServices: async () => {
    return getData(KEY_SERVICES, mockServices);
  },

  getProfessionals: async () => {
    return getData(KEY_STAFF, mockProfesionales);
  },

  checkClientByPhone: async (phone) => {
    // Simulator
    const bookings = getData(KEY_BOOKINGS, mockTurnosOcupados);
    const existing = bookings.find(b => b.clienteTelefono === phone || `15${b.clienteTelefono}` === phone);
    await new Promise(r => setTimeout(r, 500));
    return existing ? existing.clienteNombre : null;
  },

  getConfig: async () => {
    return getData(KEY_CONFIG, {
      nombreLocal: 'Tu Barbería',
      logoUrl: '/logo.png',
      telefonoContacto: '+54 9 11 3414-1804',
      diasAbiertos: '1,2,3,4,5,6',
    });
  },

  async fetchAvailability(fecha, servicioId, profesionalId) {
    const allBookings = getData(KEY_BOOKINGS, mockTurnosOcupados);
    const allServices = getData(KEY_SERVICES, mockServices);
    const allStaff = getData(KEY_STAFF, mockProfesionales);

    const turnosDelDia = allBookings.filter(
      t => t.fecha === fecha && (t.profesional_id === profesionalId || t.profesionalId === profesionalId) && t.estado !== 'cancelado'
    );

    const blocks = getData(KEY_BLOCKS, []);
    const blocksDelDia = blocks.map(b => ({
      hora_inicio: b.horaInicio,
      hora_fin: b.horaFin
    }));

    const servicio = allServices.find(s => s.id === servicioId);
    const profesional = allStaff.find(p => p.id === profesionalId);

    if (!servicio || !profesional) return { slots: [] };

    const { calculateAvailableSlots } = await import('../utils/timeUtils');
    const horario = profesional.horario_atencion || { inicio: profesional.horarioAtencionInicio, fin: profesional.horarioAtencionFin };
    const duracion = servicio.duracion_minutos || servicio.duracionMinutos;

    const slots = calculateAvailableSlots(horario, [...turnosDelDia, ...blocksDelDia], duracion);
    return { slots };
  },

  async createTurno(turnoData) {
    await new Promise(r => setTimeout(r, 600));

    const allServices = getData(KEY_SERVICES, mockServices);
    const servicio = allServices.find(s => s.id === turnoData.servicioId);
    const duracion = servicio ? (servicio.duracion_minutos || servicio.duracionMinutos) : 30;

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
      estado: 'programado',
      createdAt: new Date().toISOString()
    };

    const bookings = getData(KEY_BOOKINGS, mockTurnosOcupados);
    bookings.push(newBooking);
    saveData(KEY_BOOKINGS, bookings);

    return { ok: true, turno: newBooking };
  },


  // ── ADMIN ──
  
  async login(email, password) {
    // Al no haber login real en demo todo entra directo,
    // pero si un componente admin llama a login simulamos éxito
    const fakeToken = "demo-admin-token";
    localStorage.setItem('token', fakeToken);
    
    // Devolvemos el primer barbero como usuario logueado
    const allStaff = getData(KEY_STAFF, mockProfesionales);
    const superAdmin = allStaff[0] || { id: "a1", nombre: "Admin Local", rol: "admin" };
    localStorage.setItem('barber', JSON.stringify({ ...superAdmin, rol: 'admin', canEditServices: true }));
    return { token: fakeToken, profesional: superAdmin };
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('barber');
    window.location.href = '/';
  },

  async fetchAdminTurnos(fecha) {
    const bookings = getData(KEY_BOOKINGS, mockTurnosOcupados);
    const allServices = getData(KEY_SERVICES, mockServices);
    const allStaff = getData(KEY_STAFF, mockProfesionales);

    // Filter by date if provided
    let filtered = bookings;
    if (fecha) {
        filtered = bookings.filter(b => b.fecha === fecha);
    }

    // Hydrate mappings to match the real API returns
    return filtered.map(b => {
        const s = allServices.find(s => s.id === b.servicio_id || s.id === b.servicioId);
        const p = allStaff.find(p => p.id === b.profesional_id || p.id === b.profesionalId);
        return {
            ...b,
            servicio: { id: s?.id, nombre: s?.nombre || s?.name, precio: s?.precio },
            profesional: { id: p?.id, nombre: p?.nombre || p?.name }
        };
    });
  },

  async deleteTurno(turnoId) {
    let bookings = getData(KEY_BOOKINGS, mockTurnosOcupados);
    bookings = bookings.filter(b => b.id !== turnoId);
    saveData(KEY_BOOKINGS, bookings);
    return { success: true };
  },

  async updateTurnoStatus(turnoId, estado) {
    let bookings = getData(KEY_BOOKINGS, mockTurnosOcupados);
    bookings = bookings.map(b => b.id === turnoId ? { ...b, estado } : b);
    saveData(KEY_BOOKINGS, bookings);
    return { success: true };
  },

  // Services
  async createService(serviceData) {
    let services = getData(KEY_SERVICES, mockServices);
    const newService = { ...serviceData, id: `svc_${Date.now()}` };
    services.push(newService);
    saveData(KEY_SERVICES, services);
    return newService;
  },

  async updateService(id, serviceData) {
    let services = getData(KEY_SERVICES, mockServices);
    services = services.map(s => s.id === id ? { ...s, ...serviceData } : s);
    saveData(KEY_SERVICES, services);
    return { success: true };
  },

  async deleteService(id) {
    let services = getData(KEY_SERVICES, mockServices);
    services = services.filter(s => s.id !== id);
    saveData(KEY_SERVICES, services);
    return { success: true };
  },

  // Staff
  async getAdminStaff() {
    return getData(KEY_STAFF, mockProfesionales).map(p => ({
        ...p,
        horarioAtencionInicio: p.horario_atencion?.inicio || p.horarioAtencionInicio || '09:00',
        horarioAtencionFin: p.horario_atencion?.fin || p.horarioAtencionFin || '19:00'
    }));
  },

  async createStaff(staffData) {
    let staff = getData(KEY_STAFF, mockProfesionales);
    const newStaff = { ...staffData, id: `stf_${Date.now()}` };
    staff.push(newStaff);
    saveData(KEY_STAFF, staff);
    return newStaff;
  },

  async updateStaff(id, staffData) {
    let staff = getData(KEY_STAFF, mockProfesionales);
    staff = staff.map(s => s.id === id ? { ...s, ...staffData } : s);
    saveData(KEY_STAFF, staff);
    return { success: true };
  },

  async deleteStaff(id) {
    let staff = getData(KEY_STAFF, mockProfesionales);
    staff = staff.filter(s => s.id !== id);
    saveData(KEY_STAFF, staff);
    return { success: true };
  },

  async updateStaffPermissions(id, canEditServices) {
    let staff = getData(KEY_STAFF, mockProfesionales);
    staff = staff.map(s => s.id === id ? { ...s, canEditServices } : s);
    saveData(KEY_STAFF, staff);
    return { success: true };
  },

  async updateProfile(profileData) {
    return { success: true };
  },

  // Clients
  async getClients() {
    const bookings = getData(KEY_BOOKINGS, mockTurnosOcupados);
    
    // Group by phone to mock clients list
    const clientsMap = {};
    bookings.forEach(b => {
        if (!b.clienteTelefono) return;
        if (!clientsMap[b.clienteTelefono]) {
            clientsMap[b.clienteTelefono] = {
                telefono: b.clienteTelefono,
                nombre: b.clienteNombre,
                total_turnos: 0,
                ultimo_turno: b.fecha,
                id: `cli_${b.clienteTelefono}`
            };
        }
        clientsMap[b.clienteTelefono].total_turnos++;
        if (new Date(b.fecha) > new Date(clientsMap[b.clienteTelefono].ultimo_turno)) {
            clientsMap[b.clienteTelefono].ultimo_turno = b.fecha;
        }
    });
    return Object.values(clientsMap);
  },

  async getClientHistory(telefono) {
    const bookings = getData(KEY_BOOKINGS, mockTurnosOcupados);
    const allServices = getData(KEY_SERVICES, mockServices);
    const allStaff = getData(KEY_STAFF, mockProfesionales);

    const history = bookings.filter(b => b.clienteTelefono === telefono).map(b => {
        const s = allServices.find(s => s.id === b.servicio_id || s.id === b.servicioId);
        const p = allStaff.find(p => p.id === b.profesional_id || p.id === b.profesionalId);
        return {
            ...b,
            servicio: { nombre: s?.nombre || s?.name },
            profesional: { nombre: p?.nombre || p?.name }
        };
    });
    return history;
  },

  // Config
  async updateConfig(configData) {
    saveData(KEY_CONFIG, configData);
    return { success: true };
  },

  // Time Blocks
  async getBlocks(fecha) {
    let blocks = getData(KEY_BLOCKS, []);
    if (fecha) {
        blocks = blocks.filter(b => b.fecha === fecha);
    }
    return blocks;
  },

  async createBlock(data) {
    let blocks = getData(KEY_BLOCKS, []);
    const newBlock = { ...data, id: `blk_${Date.now()}` };
    blocks.push(newBlock);
    saveData(KEY_BLOCKS, blocks);
    return newBlock;
  },

  async deleteBlock(id) {
    let blocks = getData(KEY_BLOCKS, []);
    blocks = blocks.filter(b => b.id !== id);
    saveData(KEY_BLOCKS, blocks);
    return { success: true };
  }
};

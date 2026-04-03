# ✂️ Barbería — Sistema de Turnos Online (Demo)

> **Demo interactiva** de un sistema de reserva de turnos para barberías.  
> Todos los datos son locales y hardcodeados — no requiere backend ni base de datos.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)

---

## 🚀 Deploy Rápido

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TU_USUARIO/barberia-turnos-demo)

## ⚙️ Instalación Local

```bash
# Clonar el repo
git clone https://github.com/TU_USUARIO/barberia-turnos-demo.git
cd barberia-turnos-demo

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 📁 Estructura

```
src/
├── components/       # Componentes de UI (DaySelector, BarberSelector, etc.)
├── data/             # Datos hardcodeados (servicios, barberos, turnos)
├── pages/            # Página principal de reserva
├── services/         # API simulada (todo local, sin backend)
└── utils/            # Utilidades (cálculo de disponibilidad)
```

## ✨ Características

- 📅 Selección de día con validación de días laborales
- 💈 Catálogo de servicios con precios y duración
- 👤 Selección de barbero con fotos
- ⏰ Cálculo automático de horarios disponibles
- 📱 Diseño mobile-first totalmente responsivo
- 💾 Los turnos reservados persisten en `localStorage`

## 🎨 Stack

- **React 19** + **Vite 8**
- **Tailwind CSS 4**
- **date-fns** para manejo de fechas
- **Lucide React** para iconografía

---

<p align="center">
  <sub>Un producto de <a href="https://www.commandsoluciones.com.ar"><strong>Command Soluciones</strong></a></sub>
</p>

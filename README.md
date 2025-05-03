# Sistema de Gestión de Citas Médicas

Este es un sistema de gestión de citas médicas desarrollado con React + TypeScript para el frontend y Node.js + TypeScript para el backend.

## Características

- Listado de citas médicas
- Creación de nuevas citas
- Actualización de citas existentes
- Eliminación de citas
- Cambio de estado de las citas (pendiente, confirmada, cancelada)
- Interfaz responsiva y moderna
- Base de datos SQLite para persistencia de datos

### Preview  
**Ligt Mode**
![Captura de pantalla 2025-05-02 213558](https://github.com/user-attachments/assets/d9bdfa22-2bf1-49f4-b7f2-8554bb232f63)

**Dark Mode**
![Captura de pantalla 2025-05-02 213614](https://github.com/user-attachments/assets/832bd513-157e-423f-96a6-bc4cfe0ec4ff)

## Tecnologías Utilizadas

### Frontend
- React.js
- TypeScript
- Material-UI
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript
- SQLite
- Express Validator

### Despliegue
- Railway
- Netlify

## Instalación y Configuración

```bash
git clone https://github.com/angelmora2004/gestioncitasmedicasapp.git
cd gestioncitasmedicasapp
```

### Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

### Frontend

1. Navegar al directorio raíz del proyecto:
```bash
cd ..
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar la aplicación:
```bash
npm start
```
> Asegurate de tener Node.js y npm instalados.

## Estructura del Proyecto

```
gestion-citas-medicas/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.ts
│   │   └── database.ts
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── components/
│   │   ├── AppointmentForm.tsx
│   │   ├── AppointmentList.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── README.md
```

## API Endpoints

- `GET /api/appointments` - Obtener todas las citas
- `POST /api/appointments` - Crear una nueva cita
- `PUT /api/appointments/:id` - Actualizar una cita existente
- `DELETE /api/appointments/:id` - Eliminar una cita
- `PATCH /api/appointments/:id/status` - Actualizar el estado de una cita

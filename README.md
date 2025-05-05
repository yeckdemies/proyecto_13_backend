# Aplicación para la Gestión de Flota

En mi trabajo me he encontrado con la necesidad de crear una gestión de la flota, al estar en entorno Microsoft debo realizarla en Power App, es por esto por lo que he pensado que era una 
buena oportunidad para implemetar una primera versión usando tecnología javascript y poner en práctica todo lo aprendido. 

La aplicación está dseñada para gestionar vehículos, conductores, reservas y proveedores, también de usuarios para la gestión de toda esta información. 

## Objetivo del Proyecto

Sacar de excel la gestión de la flota para un mayor control de los datos y los vehículos. 

- CRUD de Conductores.
- CRUD de Vehículos reacionados con Proveedores.
- Gestión de Reservas relacionadas con Vehículos y Conductores
- CRUD de Proveedores.
- CRUD de Usuarios

## Beneficios de una implementación de Gestión de FLota

- Unificar en un solo lugar todos los datos relacionados con la flota.
- Control las reservas de vehículos, evitando solapamientos
- Filtros sobre todos los registros.
- Visión global mediante Dashboard.

## Carga de datos mediante Excel

Todos los datos iniciales del sistema se encuentran en un único Excel: `datos_seed.xlsx`.

Este archivo contiene las siguientes hojas:

1. **proveedores** – Datos de empresas proveedoras de los vehículos.
2. **conductores** – Información personal y de contacto de los conductores.
3. **vehiculos** – Detalles técnicos y administrativos de los vehículos.
4. **reservas** – Registros que vinculan vehículos, conductores y usuarios con fechas de uso.

No realizamos carga de usuarios.

Carga del seed.

```bash
npm run seed

```

## Instalación

```bash
//Backend
npm run dev

//Frontend
npm run dev

```

## Librerías utilizadas

### Backend (Node.js + Express)

- **express**: Framework minimalista para construir APIs REST.
- **mongoose**: ODM para conectar y manipular documentos de MongoDB.
- **dotenv**: Gestión de variables de entorno.
- **bcrypt**: Cifrado de contraseñas.
- **jsonwebtoken**: Autenticación basada en tokens JWT.
- **csv-parser**: Lectura de archivos CSV para importaciones.
- **xlsx**: Lectura y escritura de archivos Excel.
- **cors**: Habilita peticiones entre dominios (CORS).
- **multer / multer-storage-cloudinary / cloudinary / streamifier**: Gestión de subida de archivos e integración con Cloudinary.
- **nodemon**: Recarga automática del servidor en desarrollo.

### Frontend (React + Vite)

- **react** / **react-dom**: Librería base para interfaces de usuario.
- **react-router-dom**: Navegación entre rutas en SPA.
- **react-hook-form**: Manejo eficiente de formularios.
- **react-toastify**: Notificaciones personalizadas (toasts).
- **@tanstack/react-table**: Tabla moderna y componetizada con paginación, filtros y ordenación.
- **@heroicons/react**: Iconografía lista para usar en Tailwind.
- **tailwindcss** / **@tailwindcss/vite**: Framework de estilos moderno y utilitario.
- **axios**: Cliente HTTP para conectar con el backend.
- **recharts**: Gráficas interactivas y responsivas.

El proyecto usa **Vite** como entorno de desarrollo, y **ESLint** para mantener buenas prácticas de código.




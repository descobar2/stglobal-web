# STGlobal Web Platform

Aplicación full-stack construida con el starter **Fusion** para ofrecer el sitio corporativo de STGlobal y un portal de cliente con autenticación (correo y Google), agenda de consultorías y perfil editable. Incluye un backend Express con persistencia en MariaDB para usuarios y consultorías.

## Tech Stack

| Capa | Tecnologías |
|------|-------------|
| Frontend | React 18 + Vite + TypeScript + TailwindCSS + Radix UI + React Router 6 |
| Backend | Express (ESM) integrado en el mismo repo, con CORS y sesiones |
| Estado / utilidades | React Query, TanStack Query, Google OAuth, Lucide Icons |
| Base de datos | MariaDB/MySQL (modelos `users` y `consultations`) |

## Estructura destacada

- `frontend/client/` SPA completa (páginas, componentes UI, hooks).
- `frontend/client/pages/Profile.tsx` Portal del usuario autenticado (consultorías, perfil).
- `frontend/client/pages/Agenda.tsx` Agenda interactiva para seleccionar fecha/hora.
- `backend/` servidor Express (rutas `auth` y `consultations`, modelos, middlewares).

## Funcionalidades principales

- **Autenticación** con correo/contraseña y Google OAuth. Cookies httpOnly.
- **Protección de rutas** (`ProtectedRoute`) para `/profile`.
- **Gestión de perfil** editable con persistencia vía `PATCH /auth/me`.
- **Agenda/Consultorías**: selección de horarios, confirmación, re-agendado, historial automático (cuando pasa la hora el backend mueve la cita a `completed`).
- **Historial** de consultorías con ejemplo inicial para ambientes vacíos.

## Requisitos

- Node.js ≥ 20
- MariaDB/MySQL accesible (ver `.env` en `backend/` para credenciales)
- npm (el starter sugiere pnpm, pero este proyecto usa npm)

## Configuración rápida

1. **Variables de entorno**
   - `frontend/.env` y `frontend/client/.env`: `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`.
   - `backend/.env`: credenciales DB, `JWT_SECRET`, `FRONTEND_ORIGIN`, etc.

2. **Instalación**
   ```bash
   cd frontend
   npm install         # instala deps frontend
   cd ../backend
   npm install         # deps backend
   ```

3. **Migraciones automáticas**
   - `backend/models/userModel` y `consultationModel` crean/alteran tablas si faltan columnas. Solo requiere que la base exista y las credenciales sean válidas.

## Uso en desarrollo

```bash
# Backend
cd backend
npm start  # o "node server.js"

# Frontend (otro terminal)
cd frontend
npm run dev
```

El frontend asume `VITE_API_URL=http://localhost:3000`. El backend lee `FRONTEND_ORIGIN=http://localhost:5173` (puedes agregar más orígenes separados por comas).

## Scripts útiles (frontend)

- `npm run dev` – Vite + SPA.
- `npm run build` / `npm run start` – build de producción.
- `npm run typecheck`, `npm run test` – TypeScript y Vitest.

## Rutas backend relevantes

- `POST /auth/google`, `POST /auth/login`, `POST /auth/signup`, `GET/PATCH /auth/me`, `POST /auth/logout`.
- `GET /consultations` – lista agendadas + historial (mueve a `completed` si la fecha pasó).
- `POST /consultations` – confirma una nueva consultoría.
- `PATCH /consultations/:id` – re-agenda con nueva fecha/duración.

Todas las rutas de consultorías requieren sesión (`requireAuth`).

## Flujo de consultorías

1. Usuario selecciona horario en `/agenda`. Si no está logeado → redirección a `/login`.
2. Datos temporales se guardan en `localStorage` (`stglobal_consult_pending`) hasta confirmar.
3. En `/profile`, sección "Confirmar consultoría" realiza `POST /consultations`.
4. Las citas confirmadas se muestran en “Consultorías agendadas”.
5. El backend pasa citAS vencidas a estado `completed`, visibles en “Historial de consultorías”.
6. Botón “Re-agendar” guarda el ID en `localStorage` y vuelve a `/agenda` para ejecutar `PATCH /consultations/:id`.

## Notas adicionales

- Se usa `BrowserRouter future={{ v7_relativeSplatPath: true }}` para adoptar el comportamiento de React Router v7 y eliminar la advertencia de “Relative route resolution…”.
- El header (`Layout.tsx`) muestra el nombre del usuario autenticado y un botón de logout; el nombre ahora es un link para volver rápido a `/profile`.
- Eventos del navegador (`auth-changed`, `consultation-pending`, `consultations-updated`) sincronizan header, agenda y perfil sin recargar.

## Personalización

- **UI/Temas**: editar `frontend/client/global.css` y `tailwind.config.ts`.
- **Componentes**: reutiliza el set de `frontend/client/components/ui`.
- **API**: agrega nuevas rutas en `backend/routes/` y regístralas en `server.js`.

## Producción

1. Ejecuta `npm run build` en `frontend/` y despliega la carpeta resultante (según tu hosting).
2. El backend puede desplegarse como servicio Node (asegura variables y DB accesible).
3. Ajusta `FRONTEND_ORIGIN` y `VITE_API_URL` a los dominios finales.

Lista para extender: integra más módulos (reportes, minutas reales, etc.) manteniendo la separación clara entre frontend React y backend Express.

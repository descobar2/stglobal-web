# Línea base de calidad — X0
Fecha de revisión: 2026-11-05. Revisión estática del commit `622c77d499fed2551a18f0aaf42de5fea021b64e` (rama `main`).

## Inventario observado (no equivale a resultados de pruebas ejecutadas)
| Métrica | Estado inicial comprobado |
| --- | --- |
| Backend | Node.js / Express; módulo de autenticación, usuarios y consultorías con MariaDB |
| Frontend | React / Vite / TypeScript |
| Pruebas frontend | 1 archivo `frontend/client/lib/utils.spec.ts`, 5 casos declarados |
| Pruebas backend | 0 archivos de prueba; el comando `npm test` devuelve error intencional |
| Pipeline GitHub Actions | No existe `.github/workflows/` |
| Análisis estático | `tsc` disponible; no hay configuración ESLint ni SonarCloud |
| Cobertura de líneas, bugs, duplicación | **No medida**: no se debe interpretar como 0 % |
| Revisión / protección `main` | La API informa `protected: false` |

## Defectos identificados en código antes de intervenir
- **BL-01 — crítico:** los archivos `backend/routes/auth.js` y `backend/routes/consultations.js` importan `../middlewares/requireAuth.js` pero el archivo existe como `requireauth.js`: falla el arranque en Linux con filesystem sensible a mayúsculas.
- **BL-02 — alto:** `ConsultationModel.updateById()` devuelve `findById(id)` sin filtrar por `userId`; ante actualización ajena sin filas afectadas puede exponer una consultoría de otro usuario.
- **BL-03 — medio:** controlador permite fechas inválidas en orden (fin anterior al inicio) y duración incoherente.
- **BL-04 — medio:** `backend/server.js` llama `app.listen` durante importación: dificulta tests de API sin servicio externo.
- **BL-05 — seguridad:** existe contraseña de sesión por defecto `change_me` si falta `JWT_SECRET`.

## Método reproducible para medir X0 con resultados reales
1. `git checkout 622c77d499fed2551a18f0aaf42de5fea021b64e` en clon desechable.
2. `cd frontend && npm ci && npm test && npm run typecheck && npm run build`; registrar salida y timestamps.
3. `cd backend && npm ci && npm test`; el script existente no ejecuta una batería real.
4. Esta revisión no tuvo acceso a ejecución del entorno original. **No se inventan porcentajes ni tiempos**.
5. La comparación X1 deberá citar commit, versión de Node, alcance de archivos, comandos y enlaces a resultados GitHub Actions.

## Conclusión X0
No existe evidencia de Quality Gates, CI automatizado ni reporte de cobertura inicial. Existen los defectos BL-01…BL-05. Los resultados cuantitativos X0 quedan expresamente **sin medición** hasta ejecutar la base original.

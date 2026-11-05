# SQA Plan — ACS 2026
**Producto:** STGlobal Web Platform. **Repositorio:** `descobar2/stglobal-web`. **Versión inicial:** `622c77d`.

## Propósito, alcance y estrategia
Introducir aseguramiento de calidad verificable sin reescribir el producto universitario: autenticación, perfil y agenda de consultorías. Excluye carga/estrés y despliegue automático de producción, ambos fuera del alcance obligatorio del enunciado.

Estándar de referencia: ISO/IEC/IEEE 29119 (procesos, diseño y documentación de pruebas), con enfoque preventivo y trazabilidad. **No se declara certificación ISO**.

## Responsabilidades y herramientas
| Actividad | Herramienta | Criterio |
| --- | --- | --- |
| Versionado / revisión | GitHub PRs | Un PR por cambio; nunca enviar directamente a `main` |
| Pruebas UI/unidad | Vitest | `npm test` frontend debe aprobar |
| Backend unidad e integración | Node.js `node:test` y HTTP nativo | Pruebas deben aprobar; escenarios auth/consultas |
| Cobertura | Cobertura V8 nativa de Node | >=60 % líneas del conjunto de módulos definido por el pipeline |
| Análisis estático | TypeScript, ESLint, `node --check`, control de formato | Cualquier incumplimiento bloquea merge |
| Pipeline | GitHub Actions | 4 jobs obligatorios: build, test, analyze, report |
| Incidencias | GitHub Issues / revisión PR | Alta prioridad antes de fusión |

## Quality Gates obligatorios
1. `build`: `tsc`, `vite build`, sintaxis backend, sin errores.
2. `test`: frontend Vitest y backend unitarias, integración de rutas HTTP y regresión, sin fallos.
3. `test`: cobertura de líneas **>=60 %**, según ruta de inclusión publicada en workflow. No se presentará como cobertura de toda la aplicación si solo se mide un subconjunto.
4. `analyze`: lint estático, typecheck, formato en archivos de control; sin errores.
5. `report`: resumen de resultados por job, evidencias y artefactos.
6. Proteger `main` con verificaciones obligatorias tras confirmar su nombre real y éxito.

## Riesgos
- **R1:** migraciones automáticas requieren MariaDB: preparar base aislada para integración.
- **R2:** tests dependientes de servicios externos de Google: cubrir flujos locales sin credenciales reales.
- **R3:** tests solo sobre utilidades pueden inflar cobertura: publicar alcance y exclusiones sin ocultarlos.
- **R4:** GitHub App puede no tener acceso a administración de ramas: configurar manualmente si la API devuelve 403.
- **R5:** SonarCloud puede requerir proyecto vinculado y token: si no está disponible, documentar sustituto de análisis estático y limitaciones.

## Evidencias mínimas
`docs/Linea-Base-Calidad.md`, `docs/Matriz-Pruebas.md`, `docs/Reporte-Mejora.md`, `docs/Manual-Tecnico.md`, `docs/Presentacion-Resultados.md`, workflow y enlace a ejecución. No se debe afirmar que un control funciona hasta verificarlo en GitHub Actions.

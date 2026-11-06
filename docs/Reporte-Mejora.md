# Reporte de mejora — ACS 2026 (X0 vs. X1)
Fecha: 2026-11-05. Repositorio: `descobar2/stglobal-web`.

## Fuente y método
- **X0:** commit `622c77d499fed2551a18f0aaf42de5fea021b64e` (`main`), inspección estática. No hubo medición instrumental de cobertura X0.
- **X1:** commit `9c64986df6be1778a1fe97cd3e606171bef98109`, [ejecución GitHub Actions #41982493436](https://github.com/descobar2/stglobal-web/actions/runs/41982493436), Node 22 con MariaDB 11.
- **Comparabilidad:** el conteo de casos y de controles se compara directamente; la cobertura X0 **no está disponible**, por lo que no se calcula una variación porcentual de cobertura sin fuente.

| Métrica | X0 — antes | X1 — después | Evidencia |
| --- | --- | --- | --- |
| Casos de prueba backend declarados/aprobados | 0 / no aplicable | **23 / 23** | [Job test](https://github.com/descobar2/stglobal-web/actions/runs/41982493436) |
| Casos de prueba frontend | 5 definidos, no ejecutados | **15 / 15** | [Job test](https://github.com/descobar2/stglobal-web/actions/runs/41982493436) |
| Archivos de prueba frontend | 1 | 2 | `frontend/client/lib/*.spec.ts` |
| Cobertura de líneas backend | No medida | **60.26 %** | V8 en job test |
| Cobertura de ramas backend | No medida | **74.19 %** | V8 en job test |
| Cobertura de funciones backend | No medida | **71.43 %** | V8 en job test |
| Etapas CI/CD automáticas | 0 | **4**: build, test, analyze, report | [Workflow](https://github.com/descobar2/stglobal-web/actions/runs/41982493436) |
| ESLint Quality Gate | Inexistente | Aprobado; sin errores | [Job analyze](https://github.com/descobar2/stglobal-web/actions/runs/41982493436) |
| Build y typecheck | Sin ejecución X0 documentada | Aprobados | [Job build](https://github.com/descobar2/stglobal-web/actions/runs/41982493436) |
| Aislamiento de consultorías | Riesgo observado BL-02 | Prueba de acceso cruzado aprobada | IT-03/04 y RG-01 |
| Importación sensible a mayúsculas | Defecto BL-01 | Corregida | `backend/routes/` |
| Validación de duración/orden de fechas | Incompleta, BL-03 | 12 casos unitarios | `backend/tests/consultation.unit.test.js` |
| Protección de rama `main` | Desactivada | **Pendiente de configuración manual** | API de integración devuelve 403 |
| SonarCloud | No configurado | Config preparada; token/proyecto no conectados | `sonar-project.properties` |

## Alcance exacto del porcentaje
El **60.26 % NO representa toda la aplicación**. Node V8 mide únicamente archivos cargados bajo patrones `**/controllers/*.js`, `**/utils/*.js`, `**/middlewares/requireauth.js`. Se excluyen UI, rutas, modelos y otras capas. Los umbrales de calidad se verificaron dentro de ese conjunto, sin insinuar cobertura global.

## Evidencia de gate negativo
En una ejecución anterior, los jobs `build` y `analyze` fallaron por uso de `.at()` incompatible con `tsconfig ES2020` y un import sin uso. Se corrigieron. La ejecución anterior quedó cancelada por un commit posterior, pero los jobs contienen evidencia individual del rechazo:
- [Build fallido](https://github.com/descobar2/stglobal-web/actions/runs/41982018222/job/127094049862)
- [Análisis fallido](https://github.com/descobar2/stglobal-web/actions/runs/41982018222/job/127094049841)

## Resultado y limitaciones
Se ejecutó correctamente la suite y se corrigieron BL-01, BL-02 y BL-03. Se agregó separación app/servidor para testabilidad. El informe demuestra mejora del **proceso de aseguramiento**, pero no constituye una certificación ISO ni una medición válida de mejora porcentual de cobertura respecto a X0.

# Evidencias verificables
| ID | Evidencia | Enlace |
| --- | --- | --- |
| EV-01 | Pull request de implementación, sin merge | https://github.com/descobar2/stglobal-web/pull/1 |
| EV-02 | Ejecución completa aprobada, SHA `9c64986d` | https://github.com/descobar2/stglobal-web/actions/runs/41982493436 |
| EV-03 | Build exitoso | https://github.com/descobar2/stglobal-web/actions/runs/41982493436/job/127095726420 |
| EV-04 | Pruebas exitosas; 23 backend, 15 frontend, cobertura backend 60.26 % | https://github.com/descobar2/stglobal-web/actions/runs/41982493436/job/127095726898 |
| EV-05 | Análisis estático exitoso | https://github.com/descobar2/stglobal-web/actions/runs/41982493436/job/127095726757 |
| EV-06 | Reporte exitoso | https://github.com/descobar2/stglobal-web/actions/runs/41982493436/job/127096006556 |
| EV-07 | Primer fallo real de tipado (antes de corrección) | https://github.com/descobar2/stglobal-web/actions/runs/41982018222/job/127094049862 |
| EV-08 | Primer fallo real de ESLint (antes de corrección) | https://github.com/descobar2/stglobal-web/actions/runs/41982018222/job/127094049841 |

**Importante:** EV-07 y EV-08 pertenecen a una ejecución global posteriormente cancelada por publicación de nuevos commits; los errores de los jobs están en sus logs. Las métricas solo aplican al alcance V8 especificado en el workflow.
**Pendientes de evidencia:** captura auténtica del panel SonarCloud (no conectado), captura gráfica del PR/Actions para video, y ajuste administrativo de la protección de rama.

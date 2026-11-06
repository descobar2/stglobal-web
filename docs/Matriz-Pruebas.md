# Matriz de pruebas — plan previo
| ID | Tipo | Entrada/acción | Resultado esperado | Estado |
| --- | --- | --- | --- | --- |
| UT-01 | Unitario | Ventana 30 min válida | Aceptar | Aprobada en EV-04 |
| UT-02 | Unitario | Fecha no convertible | Rechazar 400 | Aprobada en EV-04 |
| UT-03 | Unitario | Fin previo a inicio | Rechazar 400 | Aprobada en EV-04 |
| UT-04 | Unitario | Duración fuera de límite | Rechazar 400 | Aprobada en EV-04 |
| UT-05 | Unitario | Token JWT válido/inválido | Autorizar/401 | Aprobada en EV-04 |
| IT-01 | Integración API | `GET /api/ping` | HTTP 200, pong | Aprobada en EV-04 |
| IT-02 | Integración API | `GET /consultations` sin sesión | HTTP 401 | Aprobada en EV-04 |
| IT-03 | Integración API/BD | Crear usuario, login, crear/listar consulta | HTTP 201/200; datos propios | Aprobada en EV-04 |
| IT-04 | Integración API/BD | Consulta de otro usuario | No revelar información ajena | Aprobada en EV-04 |
| RG-01 | Regresión | Reagendar ID ajeno | HTTP 404, sin filtrar datos de otro usuario | Aprobada en EV-04 |
| FE-01 | Unitario UI | `cn()` clases contradictorias | Consolidar clases | 5 tests existentes aprobados en X1 |
| FE-02 | Unitario UI | Horarios de agenda | Intervalos válidos dentro de horario | Aprobada en EV-04 |
| CI-01 | Quality Gate | Cambio que no supera pruebas | Build y analyze rechazaron cambios defectuosos | Aprobada en EV-04 |
| CI-02 | Quality Gate | Pull request con cambios correctos | 4 jobs aprobados en EV-02 | Aprobada en EV-04 |

Cada fila se actualizará exclusivamente con resultados de ejecución verificables; el mero código de prueba no equivale a éxito.

## Resultado global X1
- Backend: **23/23** casos aprobados, incluidos escenarios HTTP con MariaDB aislada.
- Frontend: **15/15** casos aprobados (2 archivos Vitest).
- Gate V8 backend: **60.26 %** de líneas en alcance seleccionado (aprobado).
- Run: https://github.com/descobar2/stglobal-web/actions/runs/41982493436
- CI-01: fallos efectivos de jobs build/analyze en EV-07 y EV-08, antes de la corrección; la corrida global fue cancelada al publicar nueva versión.
- CI-02: 4/4 jobs aprobados en EV-02.

# Matriz de pruebas — plan previo
| ID | Tipo | Entrada/acción | Resultado esperado | Estado |
| --- | --- | --- | --- | --- |
| UT-01 | Unitario | Ventana 30 min válida | Aceptar | Pendiente de ejecución |
| UT-02 | Unitario | Fecha no convertible | Rechazar 400 | Pendiente |
| UT-03 | Unitario | Fin previo a inicio | Rechazar 400 | Pendiente |
| UT-04 | Unitario | Duración fuera de límite | Rechazar 400 | Pendiente |
| UT-05 | Unitario | Token JWT válido/inválido | Autorizar/401 | Pendiente |
| IT-01 | Integración API | `GET /api/ping` | HTTP 200, pong | Pendiente |
| IT-02 | Integración API | `GET /consultations` sin sesión | HTTP 401 | Pendiente |
| IT-03 | Integración API/BD | Crear usuario, login, crear/listar consulta | HTTP 201/200; datos propios | Pendiente |
| IT-04 | Integración API/BD | Consulta de otro usuario | No revelar información ajena | Pendiente |
| RG-01 | Regresión | Reagendar ID ajeno | HTTP 404, sin filtrar datos de otro usuario | Pendiente |
| FE-01 | Unitario UI | `cn()` clases contradictorias | Consolidar clases | 5 tests declarados en X0; no ejecutados |
| FE-02 | Unitario UI | Horarios de agenda | Intervalos válidos dentro de horario | Pendiente |
| CI-01 | Quality Gate | Cambio que no supera pruebas | CI rechaza PR | Pendiente |
| CI-02 | Quality Gate | Pull request con cambios correctos | CI aprueba | Pendiente |

Cada fila se actualizará exclusivamente con resultados de ejecución verificables; el mero código de prueba no equivale a éxito.

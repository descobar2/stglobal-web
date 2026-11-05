# Guion para grabar el video final — 4:20 min
**Este documento es un guion; no afirma que exista un video grabado.** Grabar captura de pantalla real (OBS o equivalente) y narración, exportar MP4 720p o superior.

| Tiempo | Escena real a grabar | Narración sugerida |
| --- | --- | --- |
| 00:00–00:35 | Portada y repositorio | "Este es el proyecto ACS 2026 aplicado a STGlobal Web. Nuestro objetivo es prevenir defectos con un flujo de calidad verificable." |
| 00:35–01:45 | Rama, PR #1, archivos YAML | "Creamos una rama de trabajo y un pull request. El pipeline separa compilación, pruebas, análisis estático y reporte. Una etapa que falla impide aprobar el control." |
| 01:45–02:40 | Workflow verde #41982493436 y logs de pruebas | "La suite ejecutó 23 pruebas backend y 15 frontend. Incluimos persistencia MariaDB, validación de fechas y aislamiento entre usuarios. La cobertura V8 alcanzó 60.26 % en el conjunto de módulos seleccionado." |
| 02:40–03:15 | Jobs fallidos de ejecución inicial, después verde | "Un error TypeScript y un import sin uso provocaron fallos de build y ESLint. Tras corregirlos, las cuatro etapas fueron satisfactorias; así demostramos el control." |
| 03:15–03:50 | Reporte de métricas y dashboard de Actions | "Antes había una sola suite frontend y no existían pruebas backend ni CI. Ahora registramos pruebas y resultados verificables. No se dispone de cobertura inicial para comparar porcentajes." |
| 03:50–04:20 | Documentación, limitaciones y cierre | "Queda pendiente activar la protección administrativa de main y conectar SonarCloud para obtener su dashboard. La solución está documentada y lista para revisión." |

Antes de entregar: presentar las **capturas auténticas** y, si se dispone de SonarCloud, su dashboard real. No reemplazar por infografías ilustrativas etiquetadas como prueba.

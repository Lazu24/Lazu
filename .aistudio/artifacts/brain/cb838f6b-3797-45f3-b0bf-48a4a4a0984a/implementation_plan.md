# Plan de Implementación: Reinicio a Cero, Suite de Testing y Preparación para Producción

Este plan define las acciones para reiniciar las tablas operativas de PostgreSQL a cero (manteniendo las cuatro categorías base intactas), configurar una suite de tests automatizados para la API y la función obligatoria de validación `validFormFieldInput`, integrar un panel interactivo de pruebas para verificación en tiempo real del Sprint 1, y optimizar el entorno para despliegue en producción.

---

## Decisiones del Usuario y Puntos Críticos

> [!IMPORTANT]
> - **Datos a reiniciar**: Se vaciarán por completo las tablas de tareas (`tasks`), sesiones de concentración (`focus_sessions`) y agenda semanal (`plan_blocks`), reiniciando los contadores de secuencia (`setval`). Se preservarán las cuatro categorías base oficiales (*Trabajo*, *Personal*, *Aprendizaje* y *Salud*) y el perfil de usuario configurado con 0 minutos acumulados.
> - **Estrategia de Testing dual**: Se implementará tanto una suite automatizada de pruebas ejecutables (`npm test` con comprobaciones unitarias y de integración sobre la validación estricta del Sprint 1 y endpoints REST) como un **Panel Visual de Testing** accesible desde la interfaz para simular de forma inmediata los tres casos de la rúbrica (formulario vacío, campos incompletos y creación exitosa).

---

## 1. Visión General y Concepto

Lazu pasa de un estado con datos de demostración a un entorno limpio listo para producción (*Clean Slate*). Los nuevos usuarios inician con métricas en cero, permitiendo registrar tareas reales, planificar su agenda desde el inicio y acumular minutos de foco genuinos.

Para los evaluadores y desarrolladores, se provee:
1. **Tests automatizados** que comprueban rigurosamente los casos límite de la función `validFormFieldInput(data)`.
2. **Endpoints de prueba y reset** (`POST /api/test/reset-to-zero` y `POST /api/test/seed-demo`).
3. **Panel interactivo de testing** en la interfaz para reproducir y verificar visualmente la respuesta ante formularios vacíos, inputs incompletos, persistencia en base de datos y cambios de estado.

---

## 2. Experiencia de Usuario y Diseño Visual

### Estados Vacíos (*Empty States*) con Estética Neo Glass Dark
- **Resumen**: Al iniciar con 0 tareas y 0 minutos, los KPIs mostrarán `00 tareas`, `0 min`, `0%` de meta y una tarjeta de bienvenida que invita a crear la primera tarea.
- **Concentración**: Temporizador listo para arrancar en 25:00 min, con selector de tarea pendiente o foco libre, y contador de sesiones del día en 0.
- **Planificación**: Cuadrícula de calendario despejada con indicador de "Semana lista para planificar", permitiendo arrastrar o hacer clic para programar actividades.
- **Mis tareas**: Lista vacía con ilustración minimalista geométrica en violeta y botón directo para usar el formulario obligatorio.
- **Estadísticas**: Histograma y gráfico de donut con estados de inicio, informando que los datos se generarán al completar la primera sesión.

### Panel Interactivo de Testing (Sprint 1 Test Suite)
- Accesible desde una pestaña discreta o botón de pruebas en la barra superior o ajustes.
- Permite ejecutar con un clic:
  - **Caso 1: Formulario vacío**: Inyecta datos vacíos, comprueba que `validFormFieldInput` devuelve `false`, verifica que no se envíe al backend y enfoca el input `newTaskNameInput`.
  - **Caso 2: Campos incompletos**: Envía combinaciones con campos faltantes (`newTaskDescription`, `newTaskDueDate` o `newTaskStatus`) y comprueba el mensaje descriptivo y resaltado en rojo.
  - **Caso 3: Formulario válido**: Envía una tarea válida, comprueba que `validFormFieldInput` devuelve `true`, persiste en PostgreSQL y actualiza la lista.
  - **Botón de Reset a Cero**: Vuelve a vaciar los datos en cualquier momento para reiniciar el ciclo de pruebas.

---

## 3. Decisiones de Producto y Arquitectura

1. **Persistencia y Limpieza de PostgreSQL**:
   - *Decisión*: Limpiar `tasks`, `focus_sessions` y `plan_blocks` en PostgreSQL ejecutando `TRUNCATE ... CASCADE` o `DELETE` y reiniciando secuencias con `setval`.
   - *Razón*: Garantiza que la producción arranque limpia sin registros residuales, conservando la integridad referencial con las categorías.

2. **Suite de Pruebas Automatizadas**:
   - *Decisión*: Implementar un script de pruebas automatizadas en TypeScript ejecutables vía `npm test`.
   - *Razón*: Permite verificar la integridad de la función `validFormFieldInput(data)` y de las operaciones CRUD de PostgreSQL tanto en el entorno de desarrollo como en pipelines de integración continua.

3. **Herramientas de Testeo en Producción**:
   - *Decisión*: Integrar el modal de testing con protecciones visuales limpias dentro del sistema Neo Glass Dark sin romper el flujo del usuario regular.

---

## 4. Arquitectura Técnica y Estrategia de Datos

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          Lazu Frontend (React 19)                      │
│                                                                        │
│   ┌────────────────────┐   ┌────────────────────┐   ┌──────────────┐   │
│   │ 7 Vistas de la App │   │ Panel Interactivo  │   │ validForm    │   │
│   │  (Empty States)    │   │     de Testing     │   │ FieldInput() │   │
│   └─────────┬──────────┘   └─────────┬──────────┘   └──────┬───────┘   │
│             │                        │                     │           │
│             ▼                        ▼                     ▼           │
│      AppContext  ──────────────────────────────────────────┘           │
└──────────────────────────────────────┬─────────────────────────────────┘
                                       │ HTTP / REST
┌──────────────────────────────────────▼─────────────────────────────────┐
│                     Express Backend (server.ts)                        │
│                                                                        │
│   ┌───────────────────┐  ┌───────────────────┐  ┌──────────────────┐   │
│   │   API de Tareas,  │  │  Endpoints de     │  │  Validación en   │   │
│   │   Sesiones y Plan │  │  Reset & Testing  │  │  Servidor        │   │
│   └─────────┬─────────┘  └─────────┬─────────┘  └──────────┬───────┘   │
└─────────────┼──────────────────────┼───────────────────────┼───────────┘
              │                      │                       │
              ▼                      ▼                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Google Cloud SQL (PostgreSQL + Drizzle)                │
│                                                                        │
│   [users] ──▶ [categories] (Base: Trabajo, Personal, Aprendizaje, ...) │
│                    │                                                   │
│                    ├──▶ [tasks]          (Estado: 0 registros)         │
│                    ├──▶ [focus_sessions] (Estado: 0 registros)         │
│                    └──▶ [plan_blocks]    (Estado: 0 registros)         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Fases de Ejecución

1. **Ejecución del script SQL de limpieza**:
   - Vaciar tablas operativas (`DELETE FROM focus_sessions`, `DELETE FROM plan_blocks`, `DELETE FROM tasks`).
   - Reiniciar secuencias de IDs a 1.
   - Reiniciar `user_settings` a valores iniciales (0 minutos acumulados).
   - Asegurar que las 4 categorías base permanezcan intactas.

2. **Creación de la Suite de Tests Automatizados**:
   - Crear archivo de pruebas unitarias y de integración para `validFormFieldInput(data)`.
   - Agregar script `"test": "tsx test/validation.test.ts"` en `package.json`.
   - Cubrir los 3 casos de la rúbrica del Sprint 1: Formulario vacío, Campos incompletos, y Formulario válido.

3. **Implementación de Endpoints y Panel Visual de Testing**:
   - Endpoint `/api/test/reset-to-zero` para reiniciar datos bajo demanda.
   - Componente `TestingPanelModal.tsx` con botones de testeo de casos y reporte en vivo.
   - Acceso desde la interfaz con botón dedicado "Modo Test / Diagnóstico".

4. **Verificación de Estados Vacíos (*Empty States*) en las 7 Vistas**:
   - Comprobar que Resumen, Concentración, Planificación, Mis tareas, Estadísticas y Categorías luzcan elegantes con datos en 0.

5. **Compilación, Linting y Verificación Final**:
   - Co-ejecutar `compile_applet` y `lint_applet` para garantizar 0 errores de compilación y tipos.

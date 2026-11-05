# Lazu — Planificador personal de tareas y enfoque
> *"Organiza tu tiempo. Encuentra tu enfoque."*

Lazu es una aplicación web full-stack de alto rendimiento diseñada para la gestión consciente del tiempo, la planificación de actividades y el trabajo en bloques de concentración mediante la técnica Pomodoro, construida fielmente bajo el sistema de diseño **Neo Glass Dark**.

---

## 🚀 Stack Tecnológico

### Frontend
- **React 19** con **TypeScript**: Arquitectura modular basada en componentes funcionales reutilizables y tipado estático estricto.
- **Tailwind CSS v4**: Tokens oficiales del sistema Neo Glass Dark, tipografías Google Fonts (*Inter* y *JetBrains Mono*) y efectos de desenfoque de cristal (`backdrop-blur`).
- **React Router DOM v7**: Navegación SPA instantánea sin recarga entre las 7 vistas principales.
- **Lucide React**: Iconografía geométrica consistente.
- **Web Audio API**: Generación procedural de ruido relajante (*Lluvia suave*) para ambientación sonora durante sesiones de concentración.

### Backend
- **Node.js** & **Express.js**: API RESTful con arquitectura por capas (rutas, controladores, servicios y repositorios de acceso a datos).
- **TypeScript**: Backend fuertemente tipado ejecutado con `tsx`.
- **Drizzle ORM**: Consultas parametrizadas, migraciones de esquema y modelado de datos relacionales sin raw SQL inseguro.

### Base de datos
- **PostgreSQL en Google Cloud SQL**: Persistencia de datos relacional en la nube para usuarios, tareas, categorías, sesiones de concentración y preferencias de configuración.

---

## 🎨 Sistema de Diseño: Neo Glass Dark

- **Fondo primario**: `--bg-void-black: #0B0A12;`
- **Superficie de tarjetas y paneles**: `--surface-deep-violet: #171426;`
- **Superficie translúcida de cristal**: `--surface-glass: rgba(23, 20, 38, 0.78);`
- **Acento violeta eléctrico**: `--accent-electric-violet: #8B5CF6;`
- **Acento verde menta (acciones principales)**: `--accent-mint-green: #67E8B4;`
- **Texto principal**: `--text-cloud-white: #E8E7F0;`
- **Texto secundario y etiquetas**: `--text-muted-lavender: #9B97AC;`
- **Bordes sutiles**: `--border-subtle: rgba(232, 231, 240, 0.08);`
- **Alertas y peligro**: `--alert-danger-border: rgba(244, 63, 94, 0.35);` y `--alert-danger-text: #FDA4AF;`
- **Tipografía**: *Inter* para interfaz general y *JetBrains Mono* para temporizadores (`18:42`), duraciones (`25 min`), fechas y métricas (`63%`, `75 / 120 min`).

---

## 📋 Las 7 Vistas Principales

1. **Resumen (`/`)**: Dashboard con 4 KPIs (Tareas pendientes, Tiempo de concentración, Meta diaria, Días de constancia), tarjeta de acción inmediata "Una cosa a la vez", lista de tareas de hoy, agenda de bloques y gráfica semanal de concentración acumulada (7 h 30 m).
2. **Concentración (`/concentracion`)**: Temporizador Pomodoro con anillo circular animado (`ProgressRing`), modos Concentración / Descanso corto / Descanso largo, controles de inicio/pausa/reinicio/finalización, reproductor de ambiente sonoro procedural y registro de sesiones diarias.
3. **Planificación (`/planificacion`)**: Cuadrícula de calendario semanal interactiva (GMT+1), bloques de actividades arrastrables y seleccionables, panel de detalle con vinculación a tareas, y modal para programar nuevas actividades.
4. **Mis tareas (`/tareas`)**: Módulo de gestión y validación obligatoria del Sprint 1, filtros por estado (Todas / Pendientes / Completadas), detalle de tarea seleccionada, limpieza de tareas completadas y modal de confirmación de eliminación.
5. **Estadísticas (`/estadisticas`)**: Reporte analítico con KPIs, histograma de minutos diarios con línea de objetivo (120 min), gráfico donut de distribución por categorías (Trabajo, Personal, Aprendizaje) y tabla histórica con exportación de reporte real en formato CSV (`/api/export-csv`).
6. **Categorías (`/categorias`)**: Gestión visual de Trabajo, Personal, Aprendizaje y Salud, con selector de iconos, edición de descripción, colores, indicadores de progreso y tareas asociadas.
7. **Ajustes (`/ajustes`)**: Configuración de perfil personal, ritmo de concentración en minutos, activación de descanso automático, notificaciones, volumen ambiental, objetivo diario flexible y selección de idioma/zona horaria.

---

## 🛡️ Validación Obligatoria — Sprint 1

En la vista **Mis tareas** se implementa la función obligatoria:

```typescript
function validFormFieldInput(data: Partial<TaskFormData> | null | undefined): boolean
```

### Campos con identificadores exactos:
- `newTaskNameInput`: Nombre de la tarea (obligatorio, no vacío).
- `newTaskDescription`: Descripción (obligatoria, no vacía).
- `newTaskDueDate`: Fecha de entrega seleccionada.
- `newTaskStatus`: Opción de estado seleccionada (`pending` o `completed`).

### Comportamientos evaluados:
- **Formulario vacío / incompleto**: Devuelve `false`, previene el envío HTTP, muestra el banner de alerta estilizado en rojo/rosa (`#F43F5E`), resalta con borde de peligro los campos faltantes y enfoca automáticamente el primer campo inválido.
- **Formulario válido**: Devuelve `true`, oculta la alerta, persiste la tarea en PostgreSQL a través de `POST /api/tasks`, actualiza el estado en React y limpia los campos del formulario.

---

## 🛠️ Instalación y Ejecución

### Requisitos previos
- Node.js versión 20 o superior
- Gestor de paquetes `npm`

### Pasos de ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Variables de entorno:**
   Verificar las credenciales de conexión provistas por Google Cloud SQL en el entorno (`SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DB_NAME`).

3. **Iniciar servidor en modo desarrollo (Full-Stack Express + Vite):**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

5. **Iniciar en producción:**
   ```bash
   npm start
   ```

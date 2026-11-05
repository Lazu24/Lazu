import React from 'react';
import { useLocation } from 'react-router-dom';
import { Info } from 'lucide-react';

export const BottomBanner: React.FC = () => {
  const location = useLocation();

  const getBannerText = () => {
    switch (location.pathname) {
      case '/':
        return 'Completa una tarea desde su casilla; el resumen y la meta se actualizan. Iniciar foco abre la tarea vinculada sin marcarla como completada.';
      case '/concentracion':
        return 'Pausar conserva el tiempo restante; reanudar continúa la sesión. Finalizar solicita confirmación. El descanso comienza al terminar, sin completar la tarea.';
      case '/planificacion':
        return 'Arrastra un bloque para reprogramarlo; clic abre su detalle. Los bloques tienen altura mínima para lectura. Un cambio de horario conserva la tarea vinculada.';
      case '/tareas':
        return 'Enter agrega una tarea válida. La casilla alterna pendiente/completada. Eliminar y Limpiar completadas requieren confirmación; los conteos cambian solo al confirmar.';
      case '/estadisticas':
        return 'El período y la categoría filtran todas las métricas. Solo cuentan sesiones finalizadas. Exportar genera un CSV del periodo; los datos mostrados son conceptuales.';
      case '/categorias':
        return 'Selecciona una categoría para editarla o ver sus tareas. Al eliminarla, sus tareas pasan a Sin categoría; nunca se eliminan. Los cambios requieren guardar.';
      case '/ajustes':
        return 'Guardar aplica las preferencias. Las duraciones aceptan de 1 a 120 min; una sesión en curso no se altera. Salir con cambios pendientes solicita confirmación.';
      default:
        return 'Organiza tu tiempo. Encuentra tu enfoque con Lazu.';
    }
  };

  return (
    <footer className="mt-8 mb-4 px-4 py-3 rounded-2xl bg-[#171426]/70 border border-[rgba(232,231,240,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#9B97AC]">
      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] shrink-0">
          <Info size={13} />
        </div>
        <p className="leading-relaxed">{getBannerText()}</p>
      </div>
      <span className="shrink-0 text-[10px] font-mono tracking-wider text-[#9B97AC]/80 px-2 py-0.5 rounded bg-[#0B0A12]/60 border border-[rgba(232,231,240,0.06)] uppercase">
        Demo Conceptual
      </span>
    </footer>
  );
};

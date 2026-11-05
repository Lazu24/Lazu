import React, { useState } from 'react';
import {
  RotateCcw,
  Pause,
  Play,
  Square,
  Maximize2,
  Volume2,
  VolumeX,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { GlassCard } from '../components/ui/GlassCard.tsx';
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons.tsx';
import { ProgressRing } from '../components/ui/ProgressRing.tsx';
import { Modal } from '../components/ui/Modal.tsx';

export const FocusPage: React.FC = () => {
  const {
    timerMode,
    setTimerMode,
    timeLeft,
    totalDuration,
    isTimerRunning,
    isTimerPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    finishFocusSession,
    activeFocusTask,
    tasks,
    selectTaskForFocus,
    isAmbientSoundPlaying,
    toggleAmbientSound,
    setAmbientVolume,
    settings,
    focusSessions,
  } = useApp();

  const [isTaskPickerOpen, setIsTaskPickerOpen] = useState(false);
  const [isConfirmFinishOpen, setIsConfirmFinishOpen] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);

  // Format mm:ss in JetBrains Mono
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercentage = ((totalDuration - timeLeft) / totalDuration) * 100;

  const handleToggleTimer = () => {
    if (!isTimerRunning) {
      startTimer();
    } else if (isTimerPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  const handleFinish = async () => {
    setIsConfirmFinishOpen(false);
    await finishFocusSession();
  };

  return (
    <div className={`space-y-6 ${isImmersive ? 'fixed inset-0 z-50 bg-[#0B0A12] p-8 overflow-y-auto' : ''}`}>
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#E8E7F0]">
            Este momento es tuyo.
          </h1>
          <p className="text-sm text-[#9B97AC] mt-1">
            Menos ruido. Más espacio para concentrarte.
          </p>
        </div>
        <SecondaryButton
          icon={<Maximize2 size={16} />}
          onClick={() => setIsImmersive(!isImmersive)}
        >
          {isImmersive ? 'Salir de inmersión' : 'Vista inmersiva'}
        </SecondaryButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Center / Main Column: Timer Box (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="flex flex-col items-center justify-between py-8 px-6 min-h-[460px]">
            {/* Top mode switch & status badge */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center p-1 rounded-xl bg-[#0B0A12]/60 border border-[rgba(232,231,240,0.06)]">
                <button
                  onClick={() => setTimerMode('focus')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    timerMode === 'focus'
                      ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#E8E7F0]'
                      : 'text-[#9B97AC] hover:text-[#E8E7F0]'
                  }`}
                >
                  Concentración
                </button>
                <button
                  onClick={() => setTimerMode('shortBreak')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    timerMode === 'shortBreak'
                      ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#E8E7F0]'
                      : 'text-[#9B97AC] hover:text-[#E8E7F0]'
                  }`}
                >
                  Descanso corto
                </button>
                <button
                  onClick={() => setTimerMode('longBreak')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    timerMode === 'longBreak'
                      ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#E8E7F0]'
                      : 'text-[#9B97AC] hover:text-[#E8E7F0]'
                  }`}
                >
                  Descanso largo
                </button>
              </div>

              {/* Status Badge */}
              {isTimerRunning && !isTimerPaused ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#67E8B4]/15 border border-[#67E8B4]/30 text-[#67E8B4]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#67E8B4] animate-ping" />
                  En curso
                </span>
              ) : isTimerRunning && isTimerPaused ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#FCD34D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  Pausado
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[rgba(232,231,240,0.08)] border border-[rgba(232,231,240,0.1)] text-[#9B97AC]">
                  Listo
                </span>
              )}
            </div>

            {/* Circular Progress Ring */}
            <div className="my-6">
              <ProgressRing
                progress={progressPercentage}
                timeText={timeFormatted}
                sessionSubtitle="Sesión 4 · 25 minutos"
                size={290}
                strokeWidth={9}
                color={timerMode === 'focus' ? '#67E8B4' : '#8B5CF6'}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex items-center gap-3">
                <SecondaryButton
                  icon={<RotateCcw size={16} />}
                  onClick={resetTimer}
                >
                  Reiniciar
                </SecondaryButton>

                {isTimerRunning && !isTimerPaused ? (
                  <PrimaryButton
                    icon={<Pause size={16} fill="currentColor" />}
                    onClick={pauseTimer}
                  >
                    Pausar sesión
                  </PrimaryButton>
                ) : (
                  <PrimaryButton
                    icon={<Play size={16} fill="currentColor" />}
                    onClick={handleToggleTimer}
                  >
                    {isTimerRunning && isTimerPaused ? 'Reanudar' : 'Comenzar'}
                  </PrimaryButton>
                )}

                <SecondaryButton
                  icon={<Square size={16} />}
                  onClick={() => setIsConfirmFinishOpen(true)}
                >
                  Finalizar
                </SecondaryButton>
              </div>

              <span className="text-xs text-[#9B97AC]">
                Espacio para pausar · El progreso se guarda al finalizar
              </span>
            </div>
          </GlassCard>

          {/* Bottom Card: Tu recorrido de hoy */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#E8E7F0]">
                Tu recorrido de hoy
              </h3>
              <span className="text-xs font-mono text-[#9B97AC]">
                {focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0)} min completados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {focusSessions.length > 0 ? (
                focusSessions.slice(0, 3).map((sess) => (
                  <div
                    key={sess.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B0A12]/50 border border-[rgba(232,231,240,0.06)]"
                  >
                    <div>
                      <span className="text-[11px] font-mono text-[#9B97AC] block">
                        {sess.startTime}
                      </span>
                      <span className="text-sm font-mono font-bold text-[#E8E7F0]">
                        {sess.durationMinutes} min
                      </span>
                    </div>
                    <CheckCircle2 size={16} className="text-[#67E8B4]" />
                  </div>
                ))
              ) : (
                <div className="sm:col-span-3 text-center py-5 text-xs text-[#9B97AC]">
                  Aún no has completado sesiones hoy. ¡Inicia el temporizador para registrar tu primer bloque!
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Intention, Audio & Pause state */}
        <div className="space-y-6">
          {/* Tu intención */}
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#9B97AC]">Tu intención</span>
              <button
                onClick={() => setIsTaskPickerOpen(true)}
                className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"
              >
                {activeFocusTask ? 'Cambiar' : 'Seleccionar'}
              </button>
            </div>

            {activeFocusTask ? (
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C4B5FD]">
                  {activeFocusTask.categoryName}
                </span>

                <h3 className="text-base font-bold text-[#E8E7F0]">
                  {activeFocusTask.name}
                </h3>

                <p className="text-xs text-[#9B97AC] leading-relaxed">
                  {activeFocusTask.description || 'Sin descripción adicional.'}
                </p>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[rgba(232,231,240,0.06)] text-xs">
                  <span className="text-[#9B97AC]">Estimación de la tarea</span>
                  <span className="font-mono text-[#E8E7F0]">
                    {activeFocusTask.estimatedDuration || 25} min
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#67E8B4]/15 border border-[#67E8B4]/30 text-[#67E8B4]">
                  Foco libre
                </span>
                <h3 className="text-base font-bold text-[#E8E7F0]">
                  Concentración sin tarea vinculada
                </h3>
                <p className="text-xs text-[#9B97AC] leading-relaxed">
                  Puedes concentrarte de forma libre o vincular una tarea de tu lista.
                </p>
              </div>
            )}
          </GlassCard>

          {/* A tu ritmo (Ambient sound) */}
          <GlassCard>
            <span className="text-xs text-[#9B97AC] block mb-3">A tu ritmo</span>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    onClick={toggleAmbientSound}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                      isAmbientSoundPlaying
                        ? 'bg-[#67E8B4]/20 border border-[#67E8B4]/40 text-[#67E8B4]'
                        : 'bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-[#9B97AC]'
                    }`}
                  >
                    {isAmbientSoundPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#E8E7F0]">
                      Lluvia suave
                    </h4>
                    <p className="text-[11px] text-[#9B97AC]">
                      Ambiente sonoro · {isAmbientSoundPlaying ? 'Activado' : 'Desactivado'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleAmbientSound}
                  className="text-[#9B97AC] hover:text-[#E8E7F0]"
                >
                  {isAmbientSoundPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.ambientVolume}
                  onChange={(e) => setAmbientVolume(Number(e.target.value))}
                  className="w-full accent-[#67E8B4] h-1.5 bg-[#0B0A12] rounded-lg cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-[rgba(232,231,240,0.06)] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#9B97AC]">Siguiente descanso</span>
                  <span className="font-mono text-[#E8E7F0]">05:00</span>
                </div>
                <p className="text-[11px] text-[#9B97AC]">
                  Notificación al terminar · Inicio manual
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Estado al pausar */}
          <GlassCard className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[#9B97AC] tracking-wider uppercase">
                Estado al pausar
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C4B5FD]">
                Pausado
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="font-mono text-3xl font-bold text-[#E8E7F0]">
                {timeFormatted}
              </span>
              <PrimaryButton
                size="sm"
                icon={<Play size={13} fill="currentColor" />}
                onClick={handleToggleTimer}
              >
                Reanudar
              </PrimaryButton>
            </div>

            <p className="text-xs text-[#9B97AC]">
              Tu tiempo se conserva. Sin prisa.
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Task Picker Modal */}
      <Modal
        isOpen={isTaskPickerOpen}
        onClose={() => setIsTaskPickerOpen(false)}
        title="Cambiar intención de foco"
      >
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => {
                selectTaskForFocus(task);
                setIsTaskPickerOpen(false);
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-[#0B0A12]/40 border border-[rgba(232,231,240,0.06)] hover:border-[#8B5CF6]/40 cursor-pointer transition-colors"
            >
              <div>
                <p className="text-xs font-semibold text-[#E8E7F0]">{task.name}</p>
                <p className="text-[11px] text-[#9B97AC]">
                  {task.categoryName} · {task.estimatedDuration} min
                </p>
              </div>
              <span className="text-xs text-[#8B5CF6]">Seleccionar</span>
            </div>
          ))}
        </div>
      </Modal>

      {/* Confirm Finish Modal */}
      <Modal
        isOpen={isConfirmFinishOpen}
        onClose={() => setIsConfirmFinishOpen(false)}
        title="¿Finalizar sesión de concentración?"
      >
        <p className="text-xs text-[#9B97AC] mb-6">
          El tiempo acumulado ({Math.round((totalDuration - timeLeft) / 60) || 25} min) se guardará en tu historial de concentración y se actualizará tu meta diaria.
        </p>
        <div className="flex items-center justify-end gap-3">
          <SecondaryButton onClick={() => setIsConfirmFinishOpen(false)}>
            Cancelar
          </SecondaryButton>
          <PrimaryButton onClick={handleFinish}>
            Guardar sesión
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
};

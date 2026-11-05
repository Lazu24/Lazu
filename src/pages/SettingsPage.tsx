import React, { useState, useEffect } from 'react';
import {
  Check,
  Volume2,
  VolumeX,
  Bell,
  Moon,
  Globe,
  Minus,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { GlassCard } from '../components/ui/GlassCard.tsx';
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons.tsx';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, showToast, todayFocusMinutes } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'account' | 'privacy'>('general');

  // Form states initialized with settings
  const [name, setName] = useState(settings.name || 'Alex López');
  const [email, setEmail] = useState(settings.email || 'alex@ejemplo.com');
  const [focusDuration, setFocusDuration] = useState(settings.focusDuration || 25);
  const [shortBreak, setShortBreak] = useState(settings.shortBreak || 5);
  const [longBreak, setLongBreak] = useState(settings.longBreak || 15);
  const [autoStartBreaks, setAutoStartBreaks] = useState(settings.autoStartBreaks || false);
  const [notifySessionEnd, setNotifySessionEnd] = useState(settings.notifySessionEnd ?? true);
  const [ambientSound, setAmbientSound] = useState(settings.ambientSound || 'Lluvia suave');
  const [ambientVolume, setAmbientVolume] = useState(settings.ambientVolume || 60);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(settings.dailyGoalMinutes || 120);
  const [language, setLanguage] = useState(settings.language || 'es-ES');
  const [timezone, setTimezone] = useState(settings.timezone || 'Madrid · GMT+1');

  useEffect(() => {
    setName(settings.name);
    setEmail(settings.email);
    setFocusDuration(settings.focusDuration);
    setShortBreak(settings.shortBreak);
    setLongBreak(settings.longBreak);
    setAutoStartBreaks(settings.autoStartBreaks);
    setNotifySessionEnd(settings.notifySessionEnd);
    setAmbientSound(settings.ambientSound);
    setAmbientVolume(settings.ambientVolume);
    setDailyGoalMinutes(settings.dailyGoalMinutes);
    setLanguage(settings.language);
    setTimezone(settings.timezone);
  }, [settings]);

  const handleSaveAll = async () => {
    await updateSettings({
      name,
      email,
      focusDuration: Number(focusDuration),
      shortBreak: Number(shortBreak),
      longBreak: Number(longBreak),
      autoStartBreaks,
      notifySessionEnd,
      ambientSound,
      ambientVolume: Number(ambientVolume),
      dailyGoalMinutes: Number(dailyGoalMinutes),
      language,
      timezone,
    });
  };

  const handleResetDefaults = () => {
    setName('Alex López');
    setEmail('alex@ejemplo.com');
    setFocusDuration(25);
    setShortBreak(5);
    setLongBreak(15);
    setAutoStartBreaks(false);
    setNotifySessionEnd(true);
    setAmbientSound('Lluvia suave');
    setAmbientVolume(60);
    setDailyGoalMinutes(120);
    setLanguage('es-ES');
    setTimezone('Madrid · GMT+1');
    showToast('Valores restablecidos por defecto.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#E8E7F0]">
            A tu manera.
          </h1>
          <p className="text-sm text-[#9B97AC] mt-1">
            Ajusta Lazu a tu ritmo, no al revés.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#67E8B4]/10 border border-[#67E8B4]/30 text-xs font-medium text-[#67E8B4]">
          <Check size={14} />
          <span>Todos los cambios guardados</span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-6 border-b border-[rgba(232,231,240,0.08)] pb-2 text-sm font-medium">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2 relative transition-colors ${
            activeTab === 'general' ? 'text-[#E8E7F0]' : 'text-[#9B97AC] hover:text-[#E8E7F0]'
          }`}
        >
          General
          {activeTab === 'general' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5CF6] rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`pb-2 relative transition-colors ${
            activeTab === 'account' ? 'text-[#E8E7F0]' : 'text-[#9B97AC] hover:text-[#E8E7F0]'
          }`}
        >
          Cuenta y seguridad
          {activeTab === 'account' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5CF6] rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-2 relative transition-colors ${
            activeTab === 'privacy' ? 'text-[#E8E7F0]' : 'text-[#9B97AC] hover:text-[#E8E7F0]'
          }`}
        >
          Datos y privacidad
          {activeTab === 'privacy' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5CF6] rounded-full"></span>
          )}
        </button>
      </div>

      {/* Main Form Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Perfil personal */}
        <GlassCard className="space-y-4">
          <h3 className="text-sm font-semibold text-[#E8E7F0]">Perfil personal</h3>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#67E8B4] p-[2px] shrink-0">
              <div className="w-full h-full rounded-full bg-[#171426] flex items-center justify-center font-bold text-base text-[#E8E7F0]">
                {name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'AL'}
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs text-[#9B97AC] mb-1">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9B97AC] mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#9B97AC]">
            Tu nombre aparece solo en tu espacio personal.
          </p>
        </GlassCard>

        {/* Card 2: Apariencia */}
        <GlassCard className="space-y-4">
          <h3 className="text-sm font-semibold text-[#E8E7F0]">Apariencia</h3>

          <div className="p-4 rounded-xl bg-[#0B0A12]/60 border border-[#8B5CF6]/40 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mini visual mockup card */}
              <div className="w-16 h-12 rounded-lg bg-[#171426] border border-[rgba(232,231,240,0.1)] p-1.5 flex flex-col justify-between">
                <div className="w-8 h-1 bg-white/40 rounded-full" />
                <div className="w-full h-3 bg-[#0B0A12] rounded flex items-center px-1">
                  <div className="w-3 h-1 bg-[#67E8B4] rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#E8E7F0]">Neo Glass Dark</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/40">
                    Activo
                  </span>
                </div>
                <p className="text-[11px] text-[#9B97AC] mt-1">
                  Alto contraste · Movimiento reducido compatible
                </p>
              </div>
            </div>

            <div className="w-5 h-5 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white">
              <Check size={12} strokeWidth={3} />
            </div>
          </div>
        </GlassCard>

        {/* Card 3: Ritmo de concentración */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#E8E7F0]">
              Ritmo de concentración
            </h3>
            <span className="text-xs text-[#9B97AC]">En minutos</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-[#9B97AC] mb-1">Concentración</label>
              <input
                type="number"
                min="1"
                max="120"
                value={focusDuration}
                onChange={(e) => setFocusDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] font-mono text-sm text-[#E8E7F0] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#9B97AC] mb-1">Descanso corto</label>
              <input
                type="number"
                min="1"
                max="60"
                value={shortBreak}
                onChange={(e) => setShortBreak(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] font-mono text-sm text-[#E8E7F0] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#9B97AC] mb-1">Descanso largo</label>
              <input
                type="number"
                min="1"
                max="60"
                value={longBreak}
                onChange={(e) => setLongBreak(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] font-mono text-sm text-[#E8E7F0] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          {/* Toggle: Iniciar descansos automáticamente */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs font-medium text-[#E8E7F0]">
                Iniciar descansos automáticamente
              </p>
              <p className="text-[11px] text-[#9B97AC] mt-0.5">
                {autoStartBreaks
                  ? 'Activado: el descanso comienza de inmediato.'
                  : 'Desactivado: el siguiente ciclo empieza cuando tú decidas.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAutoStartBreaks(!autoStartBreaks)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                autoStartBreaks ? 'bg-[#67E8B4]' : 'bg-[#0B0A12] border border-[rgba(232,231,240,0.2)]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  autoStartBreaks ? 'translate-x-5 bg-[#0B0A12]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </GlassCard>

        {/* Card 4: Tu objetivo diario */}
        <GlassCard className="space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#E8E7F0]">Tu objetivo diario</h3>

            <div className="flex items-center justify-between my-4 p-3 rounded-xl bg-[#0B0A12]/60 border border-[rgba(232,231,240,0.06)]">
              <span className="text-xs text-[#9B97AC]">Minutos de foco</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDailyGoalMinutes((prev) => Math.max(prev - 15, 15))}
                  className="w-7 h-7 rounded-lg bg-[#171426] border border-[rgba(232,231,240,0.1)] flex items-center justify-center text-[#E8E7F0] hover:bg-[#231F38]"
                >
                  <Minus size={14} />
                </button>
                <span className="font-mono text-base font-bold text-[#E8E7F0] w-12 text-center">
                  {dailyGoalMinutes}
                </span>
                <button
                  type="button"
                  onClick={() => setDailyGoalMinutes((prev) => Math.min(prev + 15, 360))}
                  className="w-7 h-7 rounded-lg bg-[#171426] border border-[rgba(232,231,240,0.1)] flex items-center justify-center text-[#E8E7F0] hover:bg-[#231F38]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#9B97AC]">
            Tu progreso de hoy: {todayFocusMinutes} de {dailyGoalMinutes} minutos. Una meta flexible, sin presión.
          </p>
        </GlassCard>

        {/* Card 5: Notificaciones y sonido */}
        <GlassCard className="space-y-4">
          <h3 className="text-sm font-semibold text-[#E8E7F0]">Notificaciones y sonido</h3>

          {/* Toggle: Avisarme al terminar una sesión */}
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(232,231,240,0.06)]">
            <div>
              <p className="text-xs font-medium text-[#E8E7F0]">
                Avisarme al terminar una sesión
              </p>
              <p className="text-[11px] text-[#9B97AC] mt-0.5">
                Notificación de escritorio y señal sonora.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNotifySessionEnd(!notifySessionEnd)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                notifySessionEnd ? 'bg-[#67E8B4]' : 'bg-[#0B0A12] border border-[rgba(232,231,240,0.2)]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full transition-transform ${
                  notifySessionEnd ? 'translate-x-5 bg-[#0B0A12]' : 'translate-x-0 bg-white'
                }`}
              />
            </button>
          </div>

          {/* Sound control slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-[#67E8B4]" />
                <span className="font-medium text-[#E8E7F0]">
                  Sonido ambiente · {ambientSound}
                </span>
              </div>
              <span className="font-mono text-[#9B97AC]">{ambientVolume}%</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={ambientVolume}
              onChange={(e) => setAmbientVolume(Number(e.target.value))}
              className="w-full accent-[#67E8B4] h-1.5 bg-[#0B0A12] rounded-lg cursor-pointer"
            />

            <span className="text-[11px] text-[#9B97AC] block">
              Activado durante la concentración
            </span>
          </div>
        </GlassCard>

        {/* Card 6: Idioma y región */}
        <GlassCard className="space-y-4 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-[#E8E7F0]">Idioma y región</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-[#9B97AC] mb-1">Idioma</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none cursor-pointer"
              >
                <option value="es-ES" className="bg-[#171426]">Español (España)</option>
                <option value="en-US" className="bg-[#171426]">English (US)</option>
                <option value="fr-FR" className="bg-[#171426]">Français</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-[#9B97AC] mb-1">Zona horaria</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none cursor-pointer"
              >
                <option value="Madrid · GMT+1" className="bg-[#171426]">Madrid · GMT+1</option>
                <option value="UTC" className="bg-[#171426]">UTC</option>
                <option value="Mexico City · GMT-6" className="bg-[#171426]">Ciudad de México · GMT-6</option>
                <option value="Buenos Aires · GMT-3" className="bg-[#171426]">Buenos Aires · GMT-3</option>
              </select>
            </div>
          </div>

          <p className="text-[11px] text-[#9B97AC]">
            Semana desde el lunes · Formato de 24 horas
          </p>
        </GlassCard>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#171426] border border-[rgba(232,231,240,0.08)]">
        <div className="flex items-center gap-2 text-xs text-[#67E8B4]">
          <Check size={15} />
          <span>Preferencias guardadas · Último guardado a las 10:06</span>
        </div>

        <div className="flex items-center gap-3">
          <SecondaryButton onClick={handleResetDefaults}>
            Restablecer
          </SecondaryButton>
          <PrimaryButton onClick={handleSaveAll}>
            Guardar cambios
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

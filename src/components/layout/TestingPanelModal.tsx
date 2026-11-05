import React, { useState } from 'react';
import {
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Database,
  FlaskConical,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { validFormFieldInput, getValidationErrors } from '../../utils/validation.ts';
import { PrimaryButton, SecondaryButton, DangerButton } from '../ui/Buttons.tsx';

interface TestingPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
  timestamp: string;
}

export const TestingPanelModal: React.FC<TestingPanelModalProps> = ({ isOpen, onClose }) => {
  const { addNewTask, showToast } = useApp();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  const addResult = (name: string, passed: boolean, details: string) => {
    const time = new Date().toLocaleTimeString('es-ES');
    setTestResults((prev) => [{ name, passed, details, timestamp: time }, ...prev]);
  };

  // Run Test Case 1: Formulario Vacío
  const runTestCase1 = () => {
    setIsRunning(true);
    const emptyPayload = {
      newTaskNameInput: '',
      newTaskDescription: '',
      newTaskDueDate: '',
      newTaskStatus: '',
    };
    const isValid = validFormFieldInput(emptyPayload);
    const errors = getValidationErrors(emptyPayload);

    const passed = isValid === false && errors.firstInvalidField === 'newTaskNameInput';
    addResult(
      'Caso 1: Formulario Vacío',
      passed,
      passed
        ? 'validFormFieldInput devolvió false correctamente. Foco inicial dirigido a newTaskNameInput.'
        : 'Fallo en la validación de formulario vacío.'
    );
    showToast(passed ? 'Caso 1 superado (Formulario vacío rechazado)' : 'Caso 1 fallido');
    setIsRunning(false);
  };

  // Run Test Case 2: Campos Incompletos
  const runTestCase2 = () => {
    setIsRunning(true);
    const incompletePayload = {
      newTaskNameInput: 'Tarea sin descripción',
      newTaskDescription: '',
      newTaskDueDate: '2026-10-29',
      newTaskStatus: 'pending',
    };
    const isValid = validFormFieldInput(incompletePayload);
    const errors = getValidationErrors(incompletePayload);

    const passed =
      isValid === false &&
      errors.firstInvalidField === 'newTaskDescription' &&
      Boolean(errors.newTaskDescription);

    addResult(
      'Caso 2: Campos Incompletos',
      passed,
      passed
        ? 'validFormFieldInput devolvió false. Campo faltante "newTaskDescription" detectado y resaltado.'
        : 'Fallo al detectar campo incompleto.'
    );
    showToast(passed ? 'Caso 2 superado (Campos incompletos detectados)' : 'Caso 2 fallido');
    setIsRunning(false);
  };

  // Run Test Case 3: Formulario Válido y Persistencia
  const runTestCase3 = async () => {
    setIsRunning(true);
    const validPayload = {
      newTaskNameInput: `Tarea de prueba ${Math.floor(Math.random() * 1000)}`,
      newTaskDescription: 'Descripción de prueba para verificar persistencia real en PostgreSQL.',
      newTaskDueDate: '2026-10-29',
      newTaskStatus: 'pending',
      categoryName: 'Trabajo',
      estimatedDuration: 25,
    };

    const isValid = validFormFieldInput(validPayload);
    if (!isValid) {
      addResult('Caso 3: Formulario Válido', false, 'validFormFieldInput devolvió false inesperadamente.');
      setIsRunning(false);
      return;
    }

    try {
      const res = await addNewTask(validPayload);
      if (res.success && res.task?.id) {
        addResult(
          'Caso 3: Formulario Válido y Persistencia',
          true,
          `Tarea guardada en PostgreSQL con ID ${res.task.id}. validFormFieldInput devolvió true.`
        );
        showToast('Caso 3 superado: Tarea creada en PostgreSQL.');
      } else {
        addResult('Caso 3: Formulario Válido', false, res.error || 'Error en endpoint del backend.');
      }
    } catch (err: any) {
      addResult('Caso 3: Formulario Válido', false, err.message);
    } finally {
      setIsRunning(false);
    }
  };

  // Run All Tests
  const runAllTests = async () => {
    runTestCase1();
    runTestCase2();
    await runTestCase3();
  };

  // Reset DB to Zero
  const handleResetToZero = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/test/reset-to-zero', { method: 'POST' });
      if (!res.ok) throw new Error('Error al reiniciar base de datos');
      addResult('Reinicio a Cero', true, 'Tablas operativas vaciadas en PostgreSQL (0 tareas, 0 sesiones).');
      showToast('Base de datos reiniciada a cero.');
      window.location.reload();
    } catch (err: any) {
      addResult('Reinicio a Cero', false, err.message);
    } finally {
      setIsRunning(false);
    }
  };

  // Seed Demo Data
  const handleSeedDemo = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/test/seed-demo', { method: 'POST' });
      if (!res.ok) throw new Error('Error al poblar datos demo');
      addResult('Carga de Datos Demo', true, 'Datos de mockups cargados en PostgreSQL (3 tareas, 3 sesiones).');
      showToast('Datos demo de mockups restaurados.');
      window.location.reload();
    } catch (err: any) {
      addResult('Carga de Datos Demo', false, err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B0A12]/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#171426] border border-[#8B5CF6]/40 rounded-2xl p-6 shadow-2xl text-[#E8E7F0] z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(232,231,240,0.08)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6]">
              <FlaskConical size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#E8E7F0]">
                Panel de Testing & Diagnóstico (Sprint 1)
              </h3>
              <p className="text-xs text-[#9B97AC]">
                Verifica en vivo la rúbrica obligatoria y gestiona los estados de la base de datos.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9B97AC] hover:text-[#E8E7F0] hover:bg-[#231F38]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Buttons for Tests */}
        <div className="py-4 space-y-3">
          <span className="text-[11px] font-semibold text-[#9B97AC] uppercase tracking-wider block">
            Pruebas de Validación: validFormFieldInput(data)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={runTestCase1}
              disabled={isRunning}
              className="p-3 rounded-xl bg-[#0B0A12]/60 border border-[rgba(232,231,240,0.08)] hover:border-[#8B5CF6]/60 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#E8E7F0]">Caso 1</span>
                <Play size={12} className="text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-[#9B97AC]">Formulario vacío</p>
            </button>

            <button
              onClick={runTestCase2}
              disabled={isRunning}
              className="p-3 rounded-xl bg-[#0B0A12]/60 border border-[rgba(232,231,240,0.08)] hover:border-[#8B5CF6]/60 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#E8E7F0]">Caso 2</span>
                <Play size={12} className="text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-[#9B97AC]">Campos incompletos</p>
            </button>

            <button
              onClick={runTestCase3}
              disabled={isRunning}
              className="p-3 rounded-xl bg-[#0B0A12]/60 border border-[rgba(232,231,240,0.08)] hover:border-[#67E8B4]/60 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#67E8B4]">Caso 3</span>
                <Play size={12} className="text-[#67E8B4] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-[#9B97AC]">Válido + PostgreSQL</p>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <SecondaryButton size="sm" icon={<Play size={13} fill="currentColor" />} onClick={runAllTests} disabled={isRunning}>
              Ejecutar los 3 casos
            </SecondaryButton>

            <div className="flex items-center gap-2">
              <SecondaryButton size="sm" icon={<Database size={13} />} onClick={handleSeedDemo} disabled={isRunning}>
                Cargar Demo
              </SecondaryButton>
              <DangerButton size="sm" icon={<RotateCcw size={13} />} onClick={handleResetToZero} disabled={isRunning}>
                Reiniciar a Cero
              </DangerButton>
            </div>
          </div>
        </div>

        {/* Results Log Table */}
        <div className="flex-1 overflow-y-auto border-t border-[rgba(232,231,240,0.08)] pt-3 min-h-[160px]">
          <span className="text-[11px] font-semibold text-[#9B97AC] uppercase tracking-wider block mb-2">
            Registro de Resultados en Tiempo Real
          </span>

          {testResults.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#9B97AC]">
              Haz clic en cualquiera de los casos para ejecutar la prueba en vivo.
            </div>
          ) : (
            <div className="space-y-2">
              {testResults.map((r, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                    r.passed
                      ? 'bg-[#67E8B4]/10 border-[#67E8B4]/30 text-[#E8E7F0]'
                      : 'bg-[#F43F5E]/10 border-[#F43F5E]/30 text-[#FDA4AF]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {r.passed ? (
                      <CheckCircle2 size={16} className="text-[#67E8B4] shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={16} className="text-[#F43F5E] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold">{r.name}</span>
                      <p className="text-[11px] opacity-90 mt-0.5">{r.details}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono opacity-70 shrink-0">{r.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

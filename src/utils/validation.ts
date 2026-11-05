import { TaskFormData } from '../types/index.ts';

/**
 * Sprint 1 Mandatory Validation Function
 * Evaluates the required form fields:
 * 1. newTaskNameInput: cannot be empty or whitespace
 * 2. newTaskDescription: cannot be empty or whitespace
 * 3. newTaskDueDate: must contain a selected valid date
 * 4. newTaskStatus: must have a selected non-empty status
 *
 * @param data Form data with exact required identifiers
 * @returns boolean: true if all 4 fields are valid, false otherwise
 */
export function validFormFieldInput(data: Partial<TaskFormData> | null | undefined): boolean {
  if (!data) return false;

  const hasName = Boolean(data.newTaskNameInput && data.newTaskNameInput.trim().length > 0);
  const hasDescription = Boolean(data.newTaskDescription && data.newTaskDescription.trim().length > 0);
  const hasDueDate = Boolean(data.newTaskDueDate && data.newTaskDueDate.trim().length > 0);
  const hasStatus = Boolean(data.newTaskStatus && data.newTaskStatus.trim().length > 0);

  return hasName && hasDescription && hasDueDate && hasStatus;
}

export interface ValidationErrors {
  newTaskNameInput?: string;
  newTaskDescription?: string;
  newTaskDueDate?: string;
  newTaskStatus?: string;
  summaryMessage?: string;
  firstInvalidField?: 'newTaskNameInput' | 'newTaskDescription' | 'newTaskDueDate' | 'newTaskStatus';
}

/**
 * Returns detailed validation errors for UI highlighting and focus
 */
export function getValidationErrors(data: Partial<TaskFormData> | null | undefined): ValidationErrors {
  const errors: ValidationErrors = {};
  const missing: string[] = [];

  if (!data?.newTaskNameInput || data.newTaskNameInput.trim().length === 0) {
    errors.newTaskNameInput = 'Escribe un nombre para tu tarea.';
    missing.push('nombre');
    if (!errors.firstInvalidField) errors.firstInvalidField = 'newTaskNameInput';
  }

  if (!data?.newTaskDescription || data.newTaskDescription.trim().length === 0) {
    errors.newTaskDescription = 'Escribe una descripción.';
    missing.push('descripción');
    if (!errors.firstInvalidField) errors.firstInvalidField = 'newTaskDescription';
  }

  if (!data?.newTaskDueDate || data.newTaskDueDate.trim().length === 0) {
    errors.newTaskDueDate = 'Selecciona una fecha de entrega.';
    missing.push('fecha de entrega');
    if (!errors.firstInvalidField) errors.firstInvalidField = 'newTaskDueDate';
  }

  if (!data?.newTaskStatus || data.newTaskStatus.trim().length === 0) {
    errors.newTaskStatus = 'Selecciona un estado para la tarea.';
    missing.push('estado');
    if (!errors.firstInvalidField) errors.firstInvalidField = 'newTaskStatus';
  }

  if (missing.length === 4) {
    errors.summaryMessage = 'Escribe un nombre para tu tarea. El formulario está vacío.';
  } else if (missing.length > 0) {
    errors.summaryMessage = `Faltan campos obligatorios: ${missing.join(', ')}.`;
  }

  return errors;
}

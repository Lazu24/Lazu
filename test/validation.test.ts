import { validFormFieldInput, getValidationErrors } from '../src/utils/validation.ts';

function runUnitTests() {
  console.log('\n=============================================');
  console.log('🧪 SUITE DE PRUEBAS UNITARIAS: SPRINT 1 VALIDATION');
  console.log('=============================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
    }
  }

  // --- CASO 1: FORMULARIO VACÍO ---
  console.log('\n--- CASO 1: Formulario Vacío ---');
  assert(validFormFieldInput(null) === false, 'validFormFieldInput(null) debe devolver false');
  assert(validFormFieldInput(undefined) === false, 'validFormFieldInput(undefined) debe devolver false');
  assert(validFormFieldInput({}) === false, 'validFormFieldInput({}) debe devolver false');
  assert(
    validFormFieldInput({
      newTaskNameInput: '',
      newTaskDescription: '',
      newTaskDueDate: '',
      newTaskStatus: '',
    }) === false,
    'Formulario con strings vacíos debe devolver false'
  );
  assert(
    validFormFieldInput({
      newTaskNameInput: '   ',
      newTaskDescription: '   ',
      newTaskDueDate: '   ',
      newTaskStatus: '   ',
    }) === false,
    'Formulario con solo espacios en blanco debe devolver false'
  );

  const emptyErrors = getValidationErrors({});
  assert(
    emptyErrors.firstInvalidField === 'newTaskNameInput',
    'El foco inicial debe dirigirse a newTaskNameInput cuando está vacío'
  );
  assert(
    Boolean(emptyErrors.newTaskNameInput && emptyErrors.newTaskDescription && emptyErrors.newTaskDueDate && emptyErrors.newTaskStatus),
    'Debe registrar errores en los 4 campos obligatorios'
  );

  // --- CASO 2: CAMPOS INCOMPLETOS ---
  console.log('\n--- CASO 2: Campos Incompletos ---');
  // Falta nombre
  assert(
    validFormFieldInput({
      newTaskNameInput: '',
      newTaskDescription: 'Descripción válida',
      newTaskDueDate: '2026-10-29',
      newTaskStatus: 'pending',
    }) === false,
    'Falta newTaskNameInput -> debe devolver false'
  );

  // Falta descripción
  assert(
    validFormFieldInput({
      newTaskNameInput: 'Tarea de prueba',
      newTaskDescription: '',
      newTaskDueDate: '2026-10-29',
      newTaskStatus: 'pending',
    }) === false,
    'Falta newTaskDescription -> debe devolver false'
  );

  // Falta fecha de entrega
  assert(
    validFormFieldInput({
      newTaskNameInput: 'Tarea de prueba',
      newTaskDescription: 'Descripción válida',
      newTaskDueDate: '',
      newTaskStatus: 'pending',
    }) === false,
    'Falta newTaskDueDate -> debe devolver false'
  );

  // Falta estado
  assert(
    validFormFieldInput({
      newTaskNameInput: 'Tarea de prueba',
      newTaskDescription: 'Descripción válida',
      newTaskDueDate: '2026-10-29',
      newTaskStatus: '',
    }) === false,
    'Falta newTaskStatus -> debe devolver false'
  );

  const missingDescErrors = getValidationErrors({
    newTaskNameInput: 'Nombre presente',
    newTaskDescription: '',
    newTaskDueDate: '2026-10-29',
    newTaskStatus: 'pending',
  });
  assert(
    missingDescErrors.firstInvalidField === 'newTaskDescription',
    'El foco debe dirigirse a newTaskDescription cuando es el primer campo faltante'
  );

  // --- CASO 3: FORMULARIO VÁLIDO ---
  console.log('\n--- CASO 3: Formulario Válido ---');
  assert(
    validFormFieldInput({
      newTaskNameInput: 'Preparar informe técnico',
      newTaskDescription: 'Documentar endpoints y arquitectura',
      newTaskDueDate: '2026-10-29',
      newTaskStatus: 'pending',
    }) === true,
    'Formulario completo con status pending debe devolver true'
  );

  assert(
    validFormFieldInput({
      newTaskNameInput: 'Revisión de código',
      newTaskDescription: 'Verificar tests y reglas de calidad',
      newTaskDueDate: '2026-10-30',
      newTaskStatus: 'completed',
    }) === true,
    'Formulario completo con status completed debe devolver true'
  );

  const validErrors = getValidationErrors({
    newTaskNameInput: 'Preparar informe técnico',
    newTaskDescription: 'Documentar endpoints y arquitectura',
    newTaskDueDate: '2026-10-29',
    newTaskStatus: 'pending',
  });
  assert(
    Object.keys(validErrors).length === 0,
    'No debe existir ningún error cuando los campos son válidos'
  );

  console.log(`\n=============================================`);
  console.log(`📊 RESULTADO UNITARIO: ${passed}/${total} pruebas superadas (${Math.round((passed / total) * 100)}%)`);
  console.log(`=============================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runUnitTests();

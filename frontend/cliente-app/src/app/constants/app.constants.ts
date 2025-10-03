export const APP_CONFIG = {
  API_URL: 'http://localhost:4200/api/cliente',
  DEBOUNCE_TIME: 300,
  MESSAGE_DISPLAY_TIME: 3000,
  MODAL_DELAY: 100
} as const;

export const VALIDATION_RULES = {
  RUC_LENGTH: 11,
  MAX_RAZON_SOCIAL: 200,
  MAX_TELEFONO: 20,
  MAX_CORREO: 100,
  MAX_DIRECCION: 300,
  MIN_PHONE_DIGITS: 7
} as const;

export const SORT_FIELDS = {
  RUC: 'ruc',
  RAZON_SOCIAL: 'razonSocial',
  TELEFONO: 'telefono',
  CORREO: 'correo',
  DIRECCION: 'direccion'
} as const;

export const SEARCH_FIELDS = ['ruc', 'razonSocial'] as const;

export const MESSAGES = {
  SUCCESS: {
    CLIENTE_CREADO: 'Cliente creado correctamente',
    CLIENTE_ACTUALIZADO: 'Cliente actualizado correctamente',
    CLIENTE_ELIMINADO: 'Cliente eliminado correctamente'
  },
  ERROR: {
    RUC_REQUERIDO: 'El RUC es obligatorio',
    RUC_LONGITUD: 'El RUC debe tener exactamente 11 dígitos',
    RUC_NUMEROS: 'El RUC solo puede contener números',
    RAZON_SOCIAL_REQUERIDA: 'La razón social es obligatoria',
    EMAIL_INVALIDO: 'Formato de correo electrónico inválido',
    TELEFONO_INVALIDO: 'Formato de teléfono inválido',
    FORMULARIO_ERRORES: 'Por favor corrija los errores en el formulario',
    CONFIRMAR_ELIMINACION: '¿Está seguro de eliminar este cliente?'
  },
  UI: {
    BUSCAR_PLACEHOLDER: 'Buscar por RUC o Razón Social...',
    RUC_PLACEHOLDER: 'Ingrese el RUC (11 dígitos)',
    RAZON_SOCIAL_PLACEHOLDER: 'Ingrese la razón social',
    TELEFONO_PLACEHOLDER: 'Ingrese el teléfono',
    CORREO_PLACEHOLDER: 'Ingrese el correo electrónico',
    DIRECCION_PLACEHOLDER: 'Ingrese la dirección',
    NO_CLIENTES: 'No hay clientes registrados',
    NO_RESULTADOS: 'No se encontraron resultados',
    CARGANDO: 'Cargando clientes...',
    BUSCANDO: 'Buscando...'
  }
} as const;

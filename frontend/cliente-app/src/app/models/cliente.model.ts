export interface Cliente {
  id?: number;
  ruc: string;
  razonSocial: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}

export interface ClienteFormData {
  ruc: string;
  razonSocial: string;
  telefono: string;
  correo: string;
  direccion: string;
}

export interface FieldErrors {
  ruc: boolean;
  razonSocial: boolean;
  telefono: boolean;
  correo: boolean;
  direccion: boolean;
}

export interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

export interface SearchConfig {
  term: string;
  isSearching: boolean;
  error: string;
}

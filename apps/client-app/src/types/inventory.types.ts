// Copia exacta del Enum del backend
export enum ProjectorStatus {
  AVAILABLE = 'AVAILABLE',
  LOANED = 'LOANED',
  MAINTENANCE = 'MAINTENANCE',
}

// Interfaz para el objeto que viene de la BD
export interface Projector {
  id: string; // UUID
  serialNumber: string;
  brand: string;
  model: string;
  lumens: number;
  status: ProjectorStatus;
}

// DTO para crear (lo que enviamos en el formulario)
// Omitimos ID y Status porque el backend los genera/asigna por defecto
export interface CreateProjectorDto {
  serialNumber: string;
  brand: string;
  model: string;
  lumens: number;
}
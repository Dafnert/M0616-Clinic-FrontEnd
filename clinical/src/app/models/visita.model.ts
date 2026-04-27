export interface Odontologo {
  id_odontologo: number;
  nombre: string;
  apellidos: string;
  email: string;
}

export interface Paciente {
  id_paciente: number;
  dni: string;
  nombre: string;
  apellidos: string;
  observaciones_importantes?: string;
}

export interface Box {
  id_box: number;
  nombre: string;
}

export interface Tratamiento {
  id_tratamiento: number;
  nombre: string;
  descripcion?: string;
  precio: number;
}

export interface Visita {
  id_visita: number;
  fecha: string; // YYYY-MM-DD
  hora_inicio: string; // HH:mm
  hora_fin: string;
  motivo_consulta: string;
  notas?: string;
  estado: 'pendiente' | 'en_proceso' | 'finalizada' | 'cancelada';
  paciente: Paciente;
  odontologo: Odontologo;
  box: Box;
  tratamientos?: Tratamiento[];
}

export interface DiaAgenda {
  fecha: string;
  fechaLabel: string;
  visitas: Visita[];
}

export interface Odontologo {
  id_odontologo: number;
  nombre: string;
  apellidos: string;
  email: string;
}
export interface Patient {
  id: number;
  name: string;
  surname: string;
  age: number;
  dni: string;
  username: string;
  password: string;
  disease: string;
  observations: string;
  tiene_vih?: boolean;
  alergias?: string | null;
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

export interface DoctorVisita {
  id: number;
  name: string;
  surname: string;
  speciality: string;
}

export interface Visita {
  id_visita: number;
  fecha: string; // YYYY-MM-DD
  hora_inicio: string; // HH:mm
  hora_fin: string;
  motivo_consulta: string;
  notas?: string;
  estado: 'pendiente' | 'en_proceso' | 'finalizada' | 'cancelada';
  paciente: Patient;
  odontologo: Odontologo;
  box: Box;
  tratamientos?: Tratamiento[];
  doctor?: DoctorVisita;
}

export interface DiaAgenda {
  fecha: string;
  fechaLabel: string;
  visitas: Visita[];
}
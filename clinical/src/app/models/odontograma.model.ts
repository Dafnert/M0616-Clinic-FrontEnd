export type ColorCara = 'normal' | 'rojo' | 'azul' | 'verde' | 'amarillo' | 'negro';
export type CaraTipo = 'vestibular' | 'lingual' | 'mesial' | 'distal' | 'oclusal';
export type TipoMarcador = '' | 'X' | 'E';
export type ColorMarcador = 'rojo' | 'azul' | 'negro';

export interface CarasDiente {
  vestibular: ColorCara;
  lingual: ColorCara;
  mesial: ColorCara;
  distal: ColorCara;
  oclusal: ColorCara;
  marcador: TipoMarcador;
  marcadorColor: ColorMarcador;
}

export interface OdontogramaData {
  [numeroDiente: number]: Partial<CarasDiente>;
}

export interface Odontograma {
  id_odontograma: number;
  id_paciente: number;
  datos_json: OdontogramaData;
  ultima_actualizacion: string;
}

export const COLOR_HEX: Record<ColorCara, string> = {
  normal: '#ffffff',
  rojo: '#e53935',
  azul: '#1565c0',
  verde: '#43a047',
  amarillo: '#fdd835',
  negro: '#212121',
};

export const MARCADOR_HEX: Record<ColorMarcador, string> = {
  rojo: '#e53935',
  azul: '#1565c0',
  negro: '#212121',
};

export const DIENTES_SUPERIORES_DERECHO = [18, 17, 16, 15, 14, 13, 12, 11];
export const DIENTES_SUPERIORES_IZQUIERDO = [21, 22, 23, 24, 25, 26, 27, 28];
export const DIENTES_INFERIORES_IZQUIERDO = [31, 32, 33, 34, 35, 36, 37, 38];
export const DIENTES_INFERIORES_DERECHO = [48, 47, 46, 45, 44, 43, 42, 41];

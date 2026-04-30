import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { OdontogramaService, ToothRecord } from '../services/odontograma.service';
import {
  ColorCara, CaraTipo, TipoMarcador, ColorMarcador,
  CarasDiente, OdontogramaData,
  COLOR_HEX, MARCADOR_HEX,
  DIENTES_SUPERIORES_DERECHO, DIENTES_SUPERIORES_IZQUIERDO,
  DIENTES_INFERIORES_IZQUIERDO, DIENTES_INFERIORES_DERECHO,
} from '../models/odontograma.model';

@Component({
  selector: 'app-odontograma',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './odontograma.component.html',
  styleUrl: './odontograma.component.css',
})
export class OdontogramaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(OdontogramaService);

  idPaciente = signal(0);
  datos = signal<OdontogramaData>({});
  ultimaActualizacion = signal('');
  toast = signal<{ msg: string; ok: boolean } | null>(null);

  private records: ToothRecord[] = [];

  seleccion = signal('color:rojo');

  readonly superioresDerecho   = DIENTES_SUPERIORES_DERECHO;
  readonly superioresIzquierdo = DIENTES_SUPERIORES_IZQUIERDO;
  readonly inferioresIzquierdo = DIENTES_INFERIORES_IZQUIERDO;
  readonly inferioresDerecho   = DIENTES_INFERIORES_DERECHO;

  readonly PALETA_COLORES: { clave: string; label: string; hex: string }[] = [
    { clave: 'color:normal',   label: 'Borrar',             hex: '#ffffff' },
    { clave: 'color:rojo',     label: 'Rojo – pendiente',   hex: '#e53935' },
    { clave: 'color:azul',     label: 'Azul – realizado',   hex: '#1565c0' },
    { clave: 'color:verde',    label: 'Verde – Rx',         hex: '#43a047' },
    { clave: 'color:amarillo', label: 'Amarillo – sellado', hex: '#fdd835' },
    { clave: 'color:negro',    label: 'Negro – ausencia',   hex: '#212121' },
  ];

  readonly PALETA_MARCADORES: { clave: string; label: string; hex: string }[] = [
    { clave: 'marcador:X:rojo',  label: '✕ Extracción pdte.', hex: '#e53935' },
    { clave: 'marcador:X:azul',  label: '✕ Extracción hecha', hex: '#1565c0' },
    { clave: 'marcador:X:negro', label: '✕ Ausencia natural', hex: '#212121' },
    { clave: 'marcador:E:rojo',  label: 'E Endodoncia pdte.',  hex: '#e53935' },
    { clave: 'marcador:E:azul',  label: 'E Endodoncia hecha',  hex: '#1565c0' },
  ];

  ngOnInit() {
    const idPaciente = Number(this.route.snapshot.paramMap.get('id')) || 1;
    this.idPaciente.set(idPaciente);
    this.svc.getOdontograma(idPaciente).subscribe(({ datos, records, ultimaActualizacion }) => {
      this.datos.set({ ...datos });
      this.records = records;
      this.ultimaActualizacion.set(ultimaActualizacion);
    });
  }

  private defaults(): CarasDiente {
    return {
      vestibular: 'normal', lingual: 'normal', mesial: 'normal',
      distal: 'normal', oclusal: 'normal', marcador: '', marcadorColor: 'negro',
    };
  }

  getCaras(num: number): CarasDiente {
    return { ...this.defaults(), ...(this.datos()[num] ?? {}) };
  }

  colorHex(color: ColorCara): string {
    return COLOR_HEX[color];
  }

  marcadorHex(num: number): string {
    return MARCADOR_HEX[this.getCaras(num).marcadorColor];
  }

  onClickCara(num: number, cara: CaraTipo, event: Event): void {
    event.stopPropagation();
    const [tipo, a, b] = this.seleccion().split(':');
    if (tipo === 'color') {
      this.datos.update(d => ({ ...d, [num]: { ...(d[num] ?? {}), [cara]: a as ColorCara } }));
    } else {
      this.toggleMarcador(num, a as TipoMarcador, b as ColorMarcador);
    }
  }

  onClickDiente(num: number): void {
    const [tipo, a, b] = this.seleccion().split(':');
    if (tipo === 'marcador') {
      this.toggleMarcador(num, a as TipoMarcador, b as ColorMarcador);
    }
  }

  private toggleMarcador(num: number, marca: TipoMarcador, color: ColorMarcador): void {
    const actual = this.getCaras(num).marcador;
    const nuevo: TipoMarcador = actual === marca ? '' : marca;
    this.datos.update(d => ({
      ...d,
      [num]: { ...(d[num] ?? {}), marcador: nuevo, marcadorColor: color },
    }));
  }

  guardar(): void {
    this.svc.saveOdontograma(this.idPaciente(), this.datos(), this.records).subscribe({
      next: () => {
        this.showToast('Guardado correctamente', true);
        this.svc.getOdontograma(this.idPaciente()).subscribe(({ records }) => {
          this.records = records;
        });
      },
      error: () => this.showToast('Error al guardar', false),
    });
  }

  private showToast(msg: string, ok: boolean): void {
    this.toast.set({ msg, ok });
    setTimeout(() => this.toast.set(null), 2500);
  }
}

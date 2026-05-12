import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { StockService } from '../services/stock.service';
import { AuthService } from '../services/auth.service';
import { Stock } from '../models/stock.model';

type StockForm = { name: string; description: string; quantity: number; minimumQuantity: number; unit: string };

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css',
})
export class StockComponent implements OnInit {
  private svc = inject(StockService);
  private auth = inject(AuthService);

  isAdmin = this.auth.isAdmin();

  items = signal<Stock[]>([]);
  loading = signal(true);
  toast = signal<{ msg: string; ok: boolean } | null>(null);

  modalOpen = signal(false);
  editingItem = signal<Stock | null>(null);

  form: StockForm = { name: '', description: '', quantity: 0, minimumQuantity: 0, unit: '' };

  lowStock = computed(() => this.items().filter(i => i.quantity < i.minimumQuantity));
  lowStockNames = computed(() => this.lowStock().map(i => i.name).join(', '));

  ngOnInit() {
    this.load();
  }

  private load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: data => { this.items.set(data); this.loading.set(false); },
      error: () => { this.showToast('Error al cargar el stock', false); this.loading.set(false); },
    });
  }

  openCreate() {
    this.editingItem.set(null);
    this.form = { name: '', description: '', quantity: 0, minimumQuantity: 0, unit: '' };
    this.modalOpen.set(true);
  }

  openEdit(item: Stock) {
    this.editingItem.set(item);
    this.form = {
      name: item.name,
      description: item.description ?? '',
      quantity: item.quantity,
      minimumQuantity: item.minimumQuantity,
      unit: item.unit,
    };
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
  }

  guardar() {
    if (!this.form.name.trim() || !this.form.unit.trim()) {
      this.showToast('Nom i unitat són obligatoris', false);
      return;
    }

    const payload = {
      name: this.form.name.trim(),
      description: this.form.description.trim() || null,
      quantity: Number(this.form.quantity),
      minimumQuantity: Number(this.form.minimumQuantity),
      unit: this.form.unit.trim(),
    };

    const editing = this.editingItem();

    if (editing?.id) {
      this.svc.update(editing.id, payload).subscribe({
        next: updated => {
          this.items.update(list => list.map(i => i.id === updated.id ? updated : i));
          this.modalOpen.set(false);
          this.showToast('Article actualizat', true);
        },
        error: () => this.showToast('Error al actualizar', false),
      });
    } else {
      this.svc.create(payload).subscribe({
        next: created => {
          this.items.update(list => [...list, created]);
          this.modalOpen.set(false);
          this.showToast('Article creat', true);
        },
        error: () => this.showToast('Error al crear', false),
      });
    }
  }

  eliminar(item: Stock) {
    if (!item.id) return;
    this.svc.delete(item.id).subscribe({
      next: () => {
        this.items.update(list => list.filter(i => i.id !== item.id));
        this.showToast('Article eliminat', true);
      },
      error: () => this.showToast('Error al eliminar', false),
    });
  }

  isLow(item: Stock): boolean {
    return item.quantity < item.minimumQuantity;
  }

  private showToast(msg: string, ok: boolean) {
    this.toast.set({ msg, ok });
    setTimeout(() => this.toast.set(null), 2500);
  }
}

import { Routes } from '@angular/router';
import { AgendaComponent } from './agenda/agenda.component';

export const routes: Routes = [
  { path: '', redirectTo: 'agenda', pathMatch: 'full' },
  { path: 'agenda', component: AgendaComponent },
];

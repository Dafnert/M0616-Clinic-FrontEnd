import { Routes } from '@angular/router';
import { AgendaComponent } from './agenda/agenda.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { BoxesComponent } from './pages/boxes/boxes';
import { CrearCitaComponent } from './agenda/create/crear-cita';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'boxes', component: BoxesComponent },
  { path: 'agenda', component: AgendaComponent },
  { path: 'cita/nueva', component: CrearCitaComponent },
  { path: 'cita/editar/:id', component: CrearCitaComponent },
  { path: '**', redirectTo: '/login' }
];

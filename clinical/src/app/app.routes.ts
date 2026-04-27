import { Routes } from '@angular/router';
import { AgendaComponent } from './agenda/agenda.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { BoxesComponent } from './pages/boxes/boxes';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'boxes', component: BoxesComponent },
  { path: 'agenda', component: AgendaComponent },
  { path: '**', redirectTo: '/login' }
];

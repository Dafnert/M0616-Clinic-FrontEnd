import { Routes } from '@angular/router';
import { AgendaComponent } from './agenda/agenda.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { BoxesComponent } from './pages/boxes/boxes';
import { OdontogramaComponent } from './odontograma/odontograma.component';
import { HomeComponent } from './pages/home/home';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'boxes', component: BoxesComponent },
  { path: 'agenda', component: AgendaComponent },
  { path: 'odontograma/:id', component: OdontogramaComponent },
  { path: '**', redirectTo: '/home' }
];

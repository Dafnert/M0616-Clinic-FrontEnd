import { Routes } from '@angular/router';
import { AgendaComponent } from './agenda/agenda.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { BoxesComponent } from './pages/boxes/boxes';
import { CrearCitaComponent } from './agenda/create/crear-cita';
import { PatientProfileComponent } from './patient-profile/profile.component';
import { OdontogramaComponent } from './odontograma/odontograma.component';
import { HomeComponent } from './pages/home/home';
import { StockComponent } from './stock/stock.component';
import { ProfileComponent } from './profile/profile';



export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'boxes', component: BoxesComponent },
  { path: 'agenda', component: AgendaComponent },
  { path: 'cita/nueva', component: CrearCitaComponent },
  { path: 'cita/editar/:id', component: CrearCitaComponent },
  { path: 'patient/profile/:id', component: PatientProfileComponent },
  { path: 'odontograma/:id', component: OdontogramaComponent },
  { path: 'stock', component: StockComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '/login' }
];

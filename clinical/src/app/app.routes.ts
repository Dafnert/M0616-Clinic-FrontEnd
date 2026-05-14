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
import { FichaPacienteComponent } from './patient-dashboard/patient-dashboard.component';
import { DocumentsComponent } from './documents/documents.component';
import { UsersComponent } from './users/users.component';
import { PatientsComponent } from './patients/patients.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'boxes', component: BoxesComponent, canActivate: [authGuard] },
  { path: 'agenda', component: AgendaComponent, canActivate: [authGuard] },
  { path: 'cita/nueva', component: CrearCitaComponent, canActivate: [authGuard] },
  { path: 'cita/editar/:id', component: CrearCitaComponent, canActivate: [authGuard] },
  { path: 'patient/profile/:id', component: PatientProfileComponent, canActivate: [authGuard] },
  { path: 'odontograma/:id', component: OdontogramaComponent, canActivate: [authGuard] },
  { path: 'stock', component: StockComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'ficha-paciente/:id', component: FichaPacienteComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  { path: 'patients', component: PatientsComponent, canActivate: [authGuard] },
  { path: 'documents/:patientId', component: DocumentsComponent },
  { path: '**', redirectTo: '/login' }
];
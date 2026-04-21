import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './profile/profile';
export const routes: Routes = [
  { path: 'register', 
    component: RegisterComponent 
  },

   { path: 'profile',
    component: ProfileComponent
  },
  { path: '**',
    redirectTo: '/login' 
  }
  
];


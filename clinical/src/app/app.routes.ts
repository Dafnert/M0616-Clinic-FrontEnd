import { Routes } from '@angular/router';
// import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './login/login.component';
// import { ListnursesComponent } from './pages/listnurses/list-nurses';
// import { FindNurseComponent } from './pages/find-nurse/find-nurse';
// import { RegisterComponent } from './pages/register/register.component';
// import { ProfileComponent } from './profile/profile';
export const routes: Routes = [
  { path: '',
    redirectTo: 'login',
    pathMatch: 'full' 
  },
  // { path: 'home', 
  //   component: HomeComponent
  // },
  { path: 'login',
    component: LoginComponent
  },
  // { path: 'register', 
  //   component: RegisterComponent 
  // },
  // { path: 'nurses',
  //   component: ListnursesComponent
  // },
  // { path: 'find-nurse',
  //   component: FindNurseComponent
  // },
  //  { path: 'profile',
  //   component: ProfileComponent
  // },
  { path: '**',
    redirectTo: '/login' 
  }
  
];


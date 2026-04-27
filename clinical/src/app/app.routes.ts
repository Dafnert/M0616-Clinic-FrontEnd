import { Routes } from '@angular/router';
// import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { BoxesComponent } from './pages/boxes/boxes';
// import { ProfileComponent } from './profile/profile';
// import { ListnursesComponent } from './pages/listnurses/list-nurses';
// import { FindNurseComponent } from './pages/find-nurse/find-nurse';
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
  { path: 'register', 
    component: RegisterComponent 
  },
  { path: 'boxes',
    component: BoxesComponent
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


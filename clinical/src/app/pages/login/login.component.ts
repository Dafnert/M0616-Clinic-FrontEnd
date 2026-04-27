import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UserService]
})
export class LoginComponent{

  username = '';
  password = '';

  loginAttempts = 0;
  isLoading = false;

  loginStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  errorMessage = '';

  errorMessages = [
    'Usuario o contraseña incorrectos',
    'Segundo intento fallido',
    'Último intento',
    'Usuario bloqueado'
  ];

  constructor(
    private _userService: UserService,
    private router: Router
  ) {}
  
  login() {
  this.isLoading = true;
  this.loginStatus = 'loading';

this._userService.login(this.username, this.password).subscribe({
  next: (response) => {
  if (response.success) {
    const user = response.user;

    localStorage.setItem('id', user.id.toString());
    console.log('ID guardado:', user.id);

    this.loginStatus = 'success';
    this.errorMessage = `Bienvenido ${user.name}`;

    setTimeout(() => {
      this.router.navigate(['/boxes']);
    }, 1000);

  } else {
    this.handleLoginError(); // 👈 importante
  }

  this.isLoading = false;
},
  error: () => {
  this.handleLoginError();
  this.isLoading = false;
}
});
}


  getStatusColor(): string {
    switch (this.loginStatus) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'loading': return '#f59e0b';
      default: return '#6b7280';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
 }

 private handleLoginError() {
  this.loginAttempts++;
  this.loginStatus = 'error';
  this.errorMessage =
    this.errorMessages[
      Math.min(this.loginAttempts - 1, this.errorMessages.length - 1)
    ];
 }

}

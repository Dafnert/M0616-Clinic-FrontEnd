import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { user } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user: user = new user();
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

register() {
  this.successMessage = '';
  this.errorMessage = '';

  this.userService.register(this.user).subscribe({
    next: (response) => {
      // Comprobamos si la respuesta trae datos (por ejemplo, el username o el id del usuario creado)
      if (response && (response.id || response.username)) {
        this.successMessage = 'Registro exitoso';
        
        // Te redirige a los 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        
      } else {
        this.errorMessage = 'El backend no devolvió un usuario válido.';
      }
    },
    error: (err) => {
      console.error('Error capturado por Angular:', err);
      if (err.status === 400) {
        this.errorMessage = 'Faltan campos obligatorios o el usuario ya existe';
      } else {
        this.errorMessage = 'Error al conectar con el servidor';
      }
    }
  });
}
}
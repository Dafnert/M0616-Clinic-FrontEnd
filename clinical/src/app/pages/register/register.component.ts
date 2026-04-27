import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { user } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user: user = new user();

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  register() {
    this.userService.register(this.user).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Registro exitoso, inicia sesión');
          this.router.navigate(['/login']);
        } else {
          alert('Error en el registro');
        }
      },
      error: (err) => {
        console.error(err);

        if (err.status === 400) {
          alert('Faltan campos obligatorios');
        } else {
          alert('Error al registrar el enfermero');
        }
      }
    });
  }
}

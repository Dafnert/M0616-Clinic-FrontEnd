import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
})
export class PatientsComponent {
  loading = signal(false);
}

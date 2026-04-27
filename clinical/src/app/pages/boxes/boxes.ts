import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-boxes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boxes.html',
  styleUrls: ['./boxes.css']
})
export class BoxesComponent implements OnInit {
  doctors: any[][] = [];

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
  this.doctorService.getRandomDoctors().subscribe({
    next: (data) => {
      this.doctors = data;

      // Agrupar de 2 en 2
      this.doctors = [];
      for (let i = 0; i < 4; i++) {
        const first = data[i % data.length];
        const second = data[(i + 1) % data.length];
        this.doctors.push([first, second]);
      }

      console.log(this.doctors);
    }
  });
}
}
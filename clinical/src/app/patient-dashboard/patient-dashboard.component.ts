import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PatientProfileComponent } from '../patient-profile/profile.component';
import { OdontogramaComponent } from '../odontograma/odontograma.component';
import { DocumentsComponent } from '../documents/documents.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, PatientProfileComponent, OdontogramaComponent, DocumentsComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class FichaPacienteComponent implements OnInit {
  patientId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
  }
}
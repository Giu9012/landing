import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  // sample data for a Blackboard-like dashboard
  courses = [
    { id: 1, title: 'Matemáticas I', progress: 72, teacher: 'Prof. Ruiz' },
    { id: 2, title: 'Ciencias Naturales', progress: 45, teacher: 'Dra. Rivera' },
    { id: 3, title: 'Historia', progress: 89, teacher: 'Lic. Soto' },
  ];

  announcements = [
    { id: 1, title: 'Fechas de exámenes', date: '2025-10-03' },
    { id: 2, title: 'Taller de robótica', date: '2025-10-12' },
  ];

  assignments = [
    { id: 1, title: 'Tarea: Álgebra', course: 'Matemáticas I', due: '2025-09-30' },
    { id: 2, title: 'Informe: Ecosistemas', course: 'Ciencias Naturales', due: '2025-10-05' },
  ];
}
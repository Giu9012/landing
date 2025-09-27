import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Data } from '../../../components/data';

@Component({
  selector: 'app-curso-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './curso-detalle.html',
  styleUrls: ['./curso-detalle.css']
})
export class CursoDetalle implements OnInit {
  course: any;
  modules: any[] = [];
  assignments: any[] = [];
  announcements: any[] = [];

  constructor(public Data: Data, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.course = this.Data.getCourseById(id);

    // módulo/recursos locales en course (si existen)
    this.modules = this.course?.modules ?? [];

    // tareas y anuncios filtrados por título del curso (ajusta según estructura real)
    this.assignments = (this.Data.assignments || []).filter(a => a.course === this.course?.title);
    this.announcements = (this.Data.announcements || []).filter(a => {
      // si los anuncios tienen campo courseId, usarlo; si no, devolver todos
      if (a.id != null) return a.id === this.course?.id;
      return true;
    });
  }

  markImportant(id: number) {
    this.Data.markImportant?.(id);
  }

  toggleArchive(id: number) {
    this.Data.toggleArchive?.(id);
  }
}
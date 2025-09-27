import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })

export class Data {
  // sample data for a Blackboard-like dashboard
  courses = [
    { id: 1, title: 'Matemáticas I', progress: 72, teacher: 'Prof. Ruiz' },
    { id: 2, title: 'Ciencias Naturales', progress: 45, teacher: 'Dra. Rivera' },
    { id: 3, title: 'Historia', progress: 89, teacher: 'Lic. Soto' },
  ];

  announcements = [
    { id: 1, title: 'Fechas de exámenes', message: 'Fecha 1\n Fecha 2', date: '2025-10-03', important: false, archived: false },
    { id: 2, title: 'Taller de robótica', message: 'Taller 1\n Taller 2', date: '2025-10-12', important: false, archived: false },
  ];

  assignments = [
    { id: 1, title: 'Tarea: Álgebra', course: 'Matemáticas I', due: '2025-09-30' },
    { id: 2, title: 'Informe: Ecosistemas', course: 'Ciencias Naturales', due: '2025-10-05' },
  ];

  get totalCourses() {
    return this.courses.length || 0;
  }

  get inProgressCourses() {
    return this.courses.filter(c => c.progress < 100).length || 0;
  }

  get completedCourses() {
    return this.courses.filter(c => c.progress === 100).length || 0;
  }

  get totalAnnouncements() {
    return (this.announcements || []).length;
  }

  get importantAnnouncements() {
    return (this.announcements || []).filter(a => !!a.important).length;
  }

  get archivedAnnouncements() {
    return (this.announcements || []).filter(a => !!a.archived).length;
  }

  get totalAssignments() {
    return (this.assignments || []).length;
  }

  markImportant(id: number) {
    const item = this.announcements.find(a => a.id === id);
    if (item) item.important = true;
  }

  toggleArchive(id: number) {
    const item = this.announcements.find(a => a.id === id);
    if (item) item.archived = !item.archived;
  }

  getCourseById(id: number) {
    const course = this.courses.find(c => c.id === id);
    return (course); // Replace `of` with HttpClient call to your backend
  }

}


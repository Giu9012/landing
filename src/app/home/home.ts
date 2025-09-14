import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  year = new Date().getFullYear();

  servicios = [
    { icon: '🎓', title: 'Cursos certificados', desc: 'Programación, data, diseño y más con certificación.', link: '/servicios/cursos' },
    { icon: '🧑‍🏫', title: 'Mentorías 1:1', desc: 'Acompañamiento personalizado por expertos.', link: '/servicios/mentorias' },
    { icon: '🧪', title: 'Labs prácticos', desc: 'Aprende haciendo con proyectos guiados.', link: '/servicios/labs' },
    { icon: '🏁', title: 'Rutas de carrera', desc: 'Itinerarios para lograr objetivos concretos.', link: '/servicios/rutas' },
  ];

  certificaciones = [
    { icon: '✅', title: 'ISO 9001', subtitle: 'Gestión de calidad', desc: 'Procesos estandarizados y mejora continua.' },
    { icon: '🔒', title: 'Seguridad', subtitle: 'Buenas prácticas', desc: 'Protección de datos y privacidad.' },
    { icon: '🌎', title: 'Accesibilidad', subtitle: 'WCAG AA', desc: 'Contenido inclusivo y accesible.' },
    { icon: '🏅', title: 'Reconocimientos', subtitle: 'Comunidad', desc: 'Alianzas y premios del sector.' },
  ];

  noticias = [
    { tag: 'Evento', title: 'Maratón por la salud', desc: 'Nuestra comunidad se une en una jornada deportiva.', img: 'assets/news1.jpg', link: '/noticias/maraton' },
    { tag: 'Alianza', title: 'Convenio universitario', desc: 'Nuevas oportunidades de certificación conjunta.', img: 'assets/news2.jpg', link: '/noticias/convenio' },
    { tag: 'Lanzamiento', title: 'Nueva ruta Data Science', desc: 'Una ruta integral de 0 a avanzado.', img: 'assets/news3.jpg', link: '/noticias/data-science' },
  ];

  articulos = [
    { author: 'Dra. Rivera', date: '05 Sep 2025', title: 'Nutrición inteligente para estudiar mejor', desc: 'Cómo ajustar tu alimentación para mejorar el foco.', avatar: 'assets/author1.jpg', link: '/blog/nutricion-estudio' },
    { author: 'Psic. Lazo', date: '29 Ago 2025', title: 'Gestión del estrés académico', desc: 'Herramientas prácticas para balancear tu día a día.', avatar: 'assets/author2.jpg', link: '/blog/estres' },
    { author: 'Ing. Soto', date: '20 Ago 2025', title: 'Hábitos para aprender más rápido', desc: 'Micro-hábitos que aceleran tu progreso.', avatar: 'assets/author3.jpg', link: '/blog/habitos' },
  ];
}

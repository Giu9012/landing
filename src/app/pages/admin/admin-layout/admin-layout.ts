import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Observable, of } from 'rxjs';
import { UserService } from '../../../service/user-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet,Sidebar, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout implements OnInit{

  adminLogo = {
    small: 'assets/logo-colegio.png',
    full: 'assets/logo-Blanco.png',
  };

  adminMenuItems = [
    { icon: 'pi pi-home', label: 'Dashboard', route: 'admin/dashboard' },
    { icon: 'pi pi-users', label: 'Usuarios', route: 'admin/usuarios' },
    { icon: 'pi pi-book', label: 'Cursos', route: 'admin/cursos' },
  ];

  adminUserMenu = [
    { icon: 'pi pi-user', label: 'Perfil Admin', route: 'admin/profile' },
    { icon: 'pi pi-sign-out', label: 'Cerrar Sesión', route: 'logout' },
  ];

  user$!: Observable<SidebarUser>;

  constructor(
    private userService: UserService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    console.log('Initializing user$ in AdminLayoutComponent, isBrowser:', isPlatformBrowser(this.platformId));
    this.user$ = this.userService.getCurrentUser();
  }
}

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Observable, of } from 'rxjs';
import { UserService } from '../../../service/user-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-layout-platform',
  imports: [RouterOutlet, Sidebar, CommonModule],
  templateUrl: './layout-platform.html',
  styleUrl: './layout-platform.css'
})
export class LayoutPlatform implements OnInit{

  dashboardLogo = {
    small: 'assets/logo-colegio.png',
    full: 'assets/logo-Negro.png',
  };

  dashboardMenuItems = [
    { icon: 'pi pi-home', label: 'Dashboard', route: 'dashboard' },
    { icon: 'pi pi-book', label: 'Cursos', route: 'cursos' },
    { icon: 'pi pi-megaphone', label: 'Anuncios', route: 'anuncios' },
    { icon: 'pi pi-cog', label: 'Settings', route: 'settings' },
  ];

  dashboardUserMenu = [
    { icon: 'pi pi-user', label: 'Perfil', route: 'profile' },
    { icon: 'pi pi-sign-out', label: 'Logout', route: 'logout' },
  ];

  user$!: Observable<SidebarUser>;

  constructor(
    private userService: UserService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    console.log('Initializing user$ in LayoutPlatformComponent, isBrowser:', isPlatformBrowser(this.platformId));
    this.user$ = this.userService.getCurrentUser();
  }
}

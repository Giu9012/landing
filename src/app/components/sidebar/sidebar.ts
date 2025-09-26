import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  logo = {
    small: 'assets/logo-colegio.png',
    full: 'assets/logo-Negro.png',
  };

  menuItems: SidebarItem[] = [
    { icon: 'pi pi-home', label: 'Dashboard', route: '/dashboard' },
    { icon: 'pi pi-calendar', label: 'Calendar', route: '/calendar' },
    { icon: 'pi pi-envelope', label: 'Messages', route: '/messages' },
    { icon: 'pi pi-cog', label: 'Settings', route: '/settings' },
  ];

  user = {
    avatar: 'assets/nosotros.jpg',
    title: 'Jesus Maria',
    info: 'Cuenta Free',
  };

  userMenu: UserMenuItem[] = [
    { icon: 'pi pi-user', label: 'Perfil', route: '/profile' },
    { icon: 'pi pi-sign-out', label: 'Logout', route: '/logout' },
  ];

  userMenuOpen = false;

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }
}

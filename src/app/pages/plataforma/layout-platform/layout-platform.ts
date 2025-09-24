import { Component } from '@angular/core';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-platform',
  imports: [Sidebar, RouterOutlet],
  templateUrl: './layout-platform.html',
  styleUrl: './layout-platform.css'
})
export class LayoutPlatform {

}

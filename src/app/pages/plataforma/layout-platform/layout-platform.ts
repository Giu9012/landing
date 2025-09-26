import { Component } from '@angular/core';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { Side } from '../../../components/side/side';

@Component({
  selector: 'app-layout-platform',
  imports: [ RouterOutlet, Side],
  templateUrl: './layout-platform.html',
  styleUrl: './layout-platform.css'
})
export class LayoutPlatform {

}

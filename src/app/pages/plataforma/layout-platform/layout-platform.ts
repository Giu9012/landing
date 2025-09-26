import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../components/sidebar/sidebar';


@Component({
  selector: 'app-layout-platform',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './layout-platform.html',
  styleUrl: './layout-platform.css'
})
export class LayoutPlatform {

}

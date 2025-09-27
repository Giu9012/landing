import { Component } from '@angular/core';
import { Data } from '../../../components/data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  // sample data for a Blackboard-like dashboard
  constructor(public Data: Data) {}
}
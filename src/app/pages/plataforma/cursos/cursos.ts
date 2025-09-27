import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Data } from '../../../components/data';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css'
})
export class Cursos {
  constructor(public Data: Data) {}
}

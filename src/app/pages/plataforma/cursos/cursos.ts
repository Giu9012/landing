import { Component } from '@angular/core';
import { Data } from '../../../components/data';

@Component({
  selector: 'app-cursos',
  imports: [],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css'
})
export class Cursos {
  constructor(public Data: Data) {}
}

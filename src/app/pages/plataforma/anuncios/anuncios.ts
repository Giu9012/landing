import { Component } from '@angular/core';
import { Data } from '../../../components/data';

@Component({
  selector: 'app-anuncios',
  imports: [],
  templateUrl: './anuncios.html',
  styleUrl: './anuncios.css'
})
export class Anuncios {
  constructor(public Data: Data) {}
}

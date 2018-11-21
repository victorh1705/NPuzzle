import {Component, OnInit} from '@angular/core';
import {Puzzle} from './puzzle';

@Component({
  selector: 'app-painel-central',
  templateUrl: './painel-central.component.html',
  styleUrls: ['./painel-central.component.css']
})
export class PainelCentralComponent implements OnInit {

  puzzle: Puzzle;
  lista: Array<number>;

  constructor() {
  }

  ngOnInit() {
    this.puzzle = new Puzzle();
    this.lista = new Array<number>(this.puzzle.colunas * this.puzzle.linhas);
    for (let i = 0; i < this.lista.length; i++) {
      this.lista[i] = i;
    }

    if (!this.puzzle.rodando) {
      this.puzzle.embaralhar();
    }
  }

}

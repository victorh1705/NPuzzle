import {Component, OnInit} from '@angular/core';
import {Puzzle} from './puzzle';
import {ETipoBusca} from '../../enum/etipo-busca.enum';

import _ from 'lodash';

@Component({
  selector: 'app-painel-central',
  templateUrl: './painel-central.component.html',
  styleUrls: ['./painel-central.component.css']
})
export class PainelCentralComponent implements OnInit {

  puzzle: Puzzle;
  lista: Array<number>;
  listaPrint: Array<number>;

  constructor() {
  }

  ngOnInit() {
    this.puzzle = new Puzzle();
    this.atualizaLista();

    if (!this.puzzle.rodando) {
      this.puzzle.embaralhar();
    }
    this.copiaListaPrint();
  }

  atualizaLista() {
    this.lista = new Array<number>(this.puzzle.colunas * this.puzzle.linhas);
    this.puzzle.atualiza();
    for (let i = 0; i < this.lista.length; i++) {
      this.lista[i] = i;
    }
    this.copiaListaPrint();
  }

  atualizarGrid(linha: number, coluna: number) {
    this.puzzle.linhas = linha;
    this.puzzle.colunas = coluna;
    this.atualizaLista();
    this.puzzle.embaralhar();
    this.copiaListaPrint();
  }

  fazBusca(busca: ETipoBusca): void {
    console.table(!this.puzzle.embaralhado, this.puzzle.rodando);
    if (!this.puzzle.embaralhado && this.puzzle.rodando) {
      return;
    }

    switch (busca) {
      case ETipoBusca.AEstrela:
        this.puzzle.aEstrela();
        break;
      case ETipoBusca.Gulosa:
        this.puzzle.buscaGulosa();
        break;
      case ETipoBusca.Largura:
        this.puzzle.buscaLargura(true);
        break;
      case ETipoBusca.Ordenada:
        this.puzzle.buscaOrdenada();
        break;
      case ETipoBusca.Profundidade:
        this.puzzle.buscaProfundidade();
        break;
      case ETipoBusca.Backtracking:
        this.puzzle.backtracking();
        break;
    }

    this.copiaListaPrint();
  }

  private copiaListaPrint() {
    this.listaPrint = _.map(this.puzzle.valores, _.clone);
  }
}

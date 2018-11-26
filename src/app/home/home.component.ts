import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('menuLateral') menuLateral;
  @ViewChild('painelCentral') grid;

  constructor() { }

  ngOnInit() {
  }

  public calcular() {
    this.grid.atualizarGrid(this.menuLateral.linha, this.menuLateral.coluna);
  }

  public fazerBusca(): void {
    this.grid.fazBusca(this.menuLateral.metodoSelecionado);
  }

  proximoPasso(): void {
    if (this.grid.puzzleresultadoObtido) {
      if (!this.grid.puzzlehabilitarBotaoVParaCaminhar) {
        this.grid.puzzleprepararAnimacao();
      } else {
        this.grid.puzzlerealizarAnimacao();
        this.grid.puzzlepassosRestantes--;
      }
    }
  }
}

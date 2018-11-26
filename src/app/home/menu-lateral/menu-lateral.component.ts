import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ETipoBusca} from '../../enum/etipo-busca.enum';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {

  opcoes = [
    {label: 'Selecione um metodo', value: null},
    {label: 'Profundidade', value: ETipoBusca.Profundidade},
    {label: 'Largura', value: ETipoBusca.Largura},
    {label: 'Ordenada', value: ETipoBusca.Ordenada},
    {label: 'Gulosa', value: ETipoBusca.Gulosa},
    {label: 'A*', value: ETipoBusca.AEstrela},
    {label: 'Backtracking', value: ETipoBusca.Backtracking}
  ];

  metodoSelecionado: ETipoBusca;
  linha = 3;
  coluna = 3;

  @Output() atualizar = new EventEmitter();

  @Output() fazBusca = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}

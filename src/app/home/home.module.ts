import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PainelCentralComponent} from './painel-central/painel-central.component';
import {MenuLateralComponent} from './menu-lateral/menu-lateral.component';
import {HomeComponent} from './home.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PainelCentralComponent,
    MenuLateralComponent,
    HomeComponent
  ]
})
export class HomeModule {
}

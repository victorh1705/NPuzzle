import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PainelCentralComponent} from './painel-central/painel-central.component';
import {MenuLateralComponent} from './menu-lateral/menu-lateral.component';
import {HomeComponent} from './home.component';
import {SharedModule} from '../shared/shared.module';
import {MatGridListModule, MatSidenavModule} from '@angular/material';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {SliderModule} from 'primeng/slider';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatGridListModule,
    MatSidenavModule,
    DropdownModule,
    SliderModule,
    ButtonModule,
    FormsModule
  ],
  declarations: [
    PainelCentralComponent,
    MenuLateralComponent,
    HomeComponent
  ]
})
export class HomeModule {
}

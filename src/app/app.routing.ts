import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {PainelCentralComponent} from './home/painel-central/painel-central.component';
import {ModuleWithProviders} from '@angular/core';

const APP_ROUTES: Routes = [
  {path: '', component: HomeComponent},
  {path: 'painel-central', component: PainelCentralComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuLateralComponent } from './home/menu-lateral/menu-lateral.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuLateralComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

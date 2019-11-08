import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarComponentComponent } from './car-component/car-component.component';
import { PartComponent } from './part/part.component';

@NgModule({
  declarations: [
    AppComponent,
    CarComponentComponent,
    PartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

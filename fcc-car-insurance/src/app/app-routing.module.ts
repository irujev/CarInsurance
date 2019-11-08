import { CarComponentComponent } from './car-component/car-component.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartComponent } from '../app/part/part.component';


const routes: Routes = [
  {
    path: 'part/:id', component: PartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

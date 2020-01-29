import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(
    [
      { path: '', redirectTo: '/main', pathMatch: 'full' },
      { path: 'main', component: MainComponent }
    ]
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }

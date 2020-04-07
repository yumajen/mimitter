import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(
    [
      { path: '', redirectTo: '/main', pathMatch: 'full' },
      { path: 'main', component: MainComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
    ]
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }

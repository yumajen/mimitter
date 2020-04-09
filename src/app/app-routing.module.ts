import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginGuard } from './guard/login.guard';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(
    [
      { path: '', redirectTo: '/main', pathMatch: 'full' },
      { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
      { path: 'signup', component: SignupComponent },
    ]
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginGuard } from './guard/login.guard';
import { ProfileComponent } from './profile/profile.component';
import { User } from './user';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(
    [
      { path: '', redirectTo: '/main', pathMatch: 'full' },
      {
        path: 'main',
        component: MainComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'main/:id',
            component: ProfileComponent,
          }
        ],
      },
      { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
      { path: 'signup', component: SignupComponent },
      { path: 'user/:id', component: ProfileComponent },
      { path: 'user/:id/edit', component: ProfileEditComponent },
    ]
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }

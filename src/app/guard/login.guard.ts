import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../session.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.sessionService.checkLoginState()
      .pipe(
        map(auth => {
          // ログインしている場合は、ログイン画面へアクセスさせずにメイン画面へ遷移させる
          if (auth) {
            this.router.navigate(['/main']);
          }
          return !auth;
        }));
  }

}

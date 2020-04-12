import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../session.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.sessionService.checkLoginState()
      .pipe(
        map(session => {
          // ログインしていない場合は強制的にログイン画面へ遷移させる
          if (!session.isLogined) {
            this.router.navigate(['/login']);
          }
          return session.isLogined;
        }));
  }

}

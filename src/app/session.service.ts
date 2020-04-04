import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  sessionSubject = new Subject<boolean>();
  sessionState = this.sessionSubject.asObservable();

  constructor() { }

  login(): void {
    this.sessionSubject.next(true);
  }

  logout(): void {
    this.sessionSubject.next(false);
  }

}

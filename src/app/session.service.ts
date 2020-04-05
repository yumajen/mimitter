import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  sessionSubject = new Subject<boolean>();
  sessionState = this.sessionSubject.asObservable();

  constructor(
    private angularFireAuth: AngularFireAuth,
  ) { }

  login(account: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.auth.signInWithEmailAndPassword(account.email, account.password)
        .then(auth => {
          if (!auth.user.emailVerified) {
            this.angularFireAuth.auth.signOut();
            reject('メールアドレスが確認できていません。');
          } else {
            this.sessionSubject.next(true);
            resolve('ログインしました。');
          }
        })
        .catch(error => {
          reject('ログインに失敗しました。\n' + error);
        });
    });
  }

  logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.auth.signOut()
        .then(() => {
          this.sessionSubject.next(false);
          resolve('ログアウトしました。');
        })
        .catch(error => {
          console.log(error);
          reject('ログアウトに失敗しました。\n' + error);
        });
    });
  }

}

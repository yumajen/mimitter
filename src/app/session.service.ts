import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';

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

  signup(account: any) {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.auth.createUserWithEmailAndPassword(account.email, account.password)
        .then(auth => {
          auth.user.sendEmailVerification();
        })
        .then(() => resolve('入力したメールアドレスに確認用メールを送信しました。\nログイン画面へ移動します。'))
        .catch(error => {
          console.log(error);
          reject('アカウントの作成に失敗しました。\n' + error);
        });
    });
  }

  checkLogin(): void {
    // ログイン状況を確認する
    this.angularFireAuth.authState.subscribe(auth => {
      this.sessionSubject.next(!!auth);
    });
  }

  checkLoginState(): Observable<boolean> {
    return this.angularFireAuth.authState
      .pipe(
        map(auth => { return !!auth; })
      );
  }

}

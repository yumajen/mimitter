import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from './user';
import { Session } from './session';
import { UserAccountService } from './user-account.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  session = new Session();
  sessionSubject = new Subject<Session>();
  sessionState = this.sessionSubject.asObservable();
  currentUser: User;
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private db: AngularFirestore,
    private userAccountService: UserAccountService,
  ) {
    this.usersCollection = db.collection('users');
  }

  login(account: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.auth.signInWithEmailAndPassword(account.email, account.password)
        .then(auth => {
          if (!auth.user.emailVerified) {
            this.angularFireAuth.auth.signOut();
            reject('メールアドレスが確認できていません。');
          } else {
            this.session.isLogined = true;
            this.sessionSubject.next(this.session);
            this.userAccountService.getUser(auth.user.uid)
              .subscribe(user => {
                this.currentUser = user;
                resolve('ログインしました。');
              });
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
          this.sessionSubject.next(this.session.reset());
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
      let auth;
      this.angularFireAuth.auth.createUserWithEmailAndPassword(account.email, account.password)
        .then($auth => {
          auth = $auth;
          return auth.user.sendEmailVerification();
        })
        .then(() => {
          return this.userAccountService.createUser(new User(auth.user.uid, account.name));
        })
        .then(() => this.angularFireAuth.auth.signOut())
        .then(() => resolve('入力したメールアドレスに確認用メールを送信しました。\nログイン画面へ移動します。'))
        .catch(error => {
          console.log(error);
          reject('アカウントの作成に失敗しました。\n' + error);
        });
    });
  }

  checkLogin(): void {
    // ログイン状況を確認する
    this.angularFireAuth.authState
      .pipe(
        switchMap(auth => {
          // ユーザー情報がなければnull、あればその情報を新しいObservableとして返す
          if (!auth) {
            return of(null);
          } else {
            return this.userAccountService.getUser(auth.uid);
          }
        })
      )
      .subscribe(auth => {
        this.currentUser = auth;
        this.session.isLogined = !!auth;
        this.session.user = !!auth ? auth : new User();
        this.sessionSubject.next(this.session);
      });
  }

  checkLoginState(): Observable<Session> {
    return this.angularFireAuth.authState
      .pipe(
        map(auth => {
          this.session.isLogined = !!auth;
          return this.session;
        })
      );
  }

  updateSessionState(param: User): void {
    this.session.user = param;
    this.sessionSubject.next(this.session);
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { User } from './user';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(
    private db: AngularFirestore,
  ) {
    this.usersCollection = db.collection('users');
  }

  getUser(id: string): Observable<User> {
    return this.usersCollection.doc(id)
      .valueChanges()
      .pipe(
        take(1),
        switchMap((user: User) => {
          return of(user);
        })
      );
  }

  createUser(user: User): Promise<void> {
    user.createdAt = Date.now();
    return this.usersCollection.doc(user.id).set(user.deserialize());
  }

  updateUser(param: User): Promise<void> {
    return this.usersCollection.doc(param.id).update(param);
  }

}

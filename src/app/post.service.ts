import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from './post';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsCollection: AngularFirestoreCollection<Post>;

  constructor(
    private db: AngularFirestore,
  ) {
    this.postsCollection = db.collection<Post>('posts', ref => ref.orderBy('createdAt', 'desc'));
  }

  getPosts(): Observable<Post[]> {
    return this.postsCollection.valueChanges();
  }

  createPost(param: Post): Promise<void> {
    const createdId = this.db.createId();
    const item: Post = {
      id: createdId,
      sentence: param.sentence,
      createdAt: Date.now(),
    };
    return this.postsCollection.doc(createdId).set(item);
  }

  updatePost(param: Post): Promise<void> {
    return this.postsCollection.doc(param.id).update(param);
  }

  deletePost(id: string): Promise<void> {
    return this.postsCollection.doc(id).delete();
  }

}

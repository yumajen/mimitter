import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { FormBuilder } from '@angular/forms';
import { Post } from '../post';
import { SessionService } from '../session.service';
import { User } from '../user';
import { UserAccountService } from '../user-account.service';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  posts: Post[] = [];
  isEditing = false;
  editingPost: Post; // 編集中のポスト
  updateParam: any = {}; // 更新用パラメータ
  editingSentence: string; // 編集中の文
  lengthOfEditingSentence: number = null;
  currentUser: User;
  userInformations$ = new BehaviorSubject<any[]>([]);
  userInformations: any[] = []; // 各ポストに紐づくユーザー情報

  postForm = this.fb.group({
    sentence: [''],
  });

  readonly maxWords = 140;

  constructor(
    private postService: PostService,
    private sessionService: SessionService,
    private userAccountService: UserAccountService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getCurrentUser();
    this.getPosts();
  }

  getCurrentUser(): void {
    this.currentUser = this.sessionService.currentUser;
    if (!this.currentUser) {
      this.sessionService.sessionState
        .subscribe(session => {
          this.currentUser = session.user;
        });
    }
  }

  getPosts(): void {
    this.postService.getPosts()
      .subscribe(posts => {
        this.getUserInformations(posts);
        this.userInformations$
          .subscribe(v => {
            if (v.length !== posts.length) { return; }
            // ポスト配列とユーザー情報配列の要素数が等しい時のみ表示される
            this.userInformations = v;
            this.posts = posts.sort((a, b) => b.createdAt - a.createdAt);
          });
      });
  }

  createPost(): void {
    this.postService.createPost(this.postForm.value as Post)
      .then(() => {
        // フォーム内容をクリアする(resetメソッドだとnullとなるためisPostableメソッド内で落ちる)
        this.postForm.get('sentence').setValue('');
      })
      .catch((error: Error) => {
        console.log('Post error', error);
      });
  }

  editPost(post: Post): void {
    // 投稿を編集モードにする
    this.isEditing = true;
    this.editingPost = post;
  }

  updatePost(post: Post): void {
    // 更新用パラメータが設定されていない場合は処理しない
    if (Object.keys(this.updateParam).length === 0) {
      this.cancelEditing();
      return;
    }
    // 編集後の文字数が許容範囲外の場合は処理しない
    if (!this.isPostable(this.updateParam.sentence)) {
      this.cancelEditing();
      return;
    }
    // 別のポストを編集モードにした場合は元のポスト更新処理を中断する
    if (post.id !== this.updateParam.id) {
      this.cancelEditing();
      return;
    }

    this.postService.updatePost(this.updateParam as Post)
      .then(() => {
        this.cancelEditing();
      })
      .catch((error: Error) => {
        console.log('Update error', error);
      });
  }

  deletePost(id: string): void {
    // ポスト編集中は削除出来ないようにする
    if (this.isEditing) { return; }
    this.postService.deletePost(id)
      .then()
      .catch((error: Error) => {
        console.log('Delete error', error);
      });
  }

  isEdit(post: Post): boolean {
    if (!this.editingPost) { return; }
    return this.editingPost.id === post.id;
  }

  isPostable(sentence: string): boolean {
    // 文字数をチェックし投稿可能かどうかを判定する
    return 0 < sentence.length && sentence.length <= this.maxWords;
  }

  setUpdateParam(post: Post, value: string) {
    // 更新用パラメータをセットする
    this.updateParam = Object.assign({}, post);
    this.updateParam.sentence = value;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.updateParam = {};
    this.editingPost = null;
    this.editingSentence = null;
    this.lengthOfEditingSentence = 0;
  }

  getEditingSentence(sentence: string) {
    this.editingSentence = sentence;
    this.lengthOfEditingSentence = sentence ? sentence.length : 0;
  }

  isCurrentUserPost(userId: string): boolean {
    return userId === this.currentUser.id;
  }

  getUserInformations(posts: Post[]): void {
    const userInformations = [];
    posts.forEach((post, index) => {
      this.userAccountService.getUser(post.userId)
        .subscribe(user => {
          userInformations[index] = {
            id: user.id,
            name: user.name,
            iconUrl: user.iconUrl,
            isCurrentUser: post.userId === this.currentUser.id,
          };
          // userInformationsの一番最後の要素に値を設定したらnextでuserInformationsを流す
          if (index === posts.length - 1) {
            this.userInformations$.next(userInformations);
          }
        });
    });
  }

  directToUserProfile(userId: string): void {
    this.router.navigate([`/user/${userId}`]);
  }

}

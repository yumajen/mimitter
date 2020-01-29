import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { FormBuilder } from '@angular/forms';
import { Post } from '../post';
import * as uuid from 'uuid';

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

  postForm = this.fb.group({
    sentence: [''],
  });

  readonly maxWords = 140;

  constructor(
    private postService: PostService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.getPosts();
  }

  getPosts(): void {
    this.postService.getPosts()
      .subscribe(posts => {
        this.posts = posts.sort((a, b) => b.createdAt - a.createdAt);
      });
  }

  createPost(): void {
    const param = this.postForm.value;
    param.id = uuid.v4(); // UUIDを生成
    param.createdAt = Date.now();
    this.postService.createPost(this.postForm.value as Post)
      .subscribe(() => {
        this.getPosts();
        // フォーム内容をクリアする(resetメソッドだとnullとなるためisPostableメソッド内で落ちる)
        this.postForm.get('sentence').setValue('');
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
      .subscribe(() => {
        this.getPosts();
        this.cancelEditing();
      });
  }

  deletePost(id: string): void {
    // ポスト編集中は削除出来ないようにする
    if (this.isEditing) { return; }
    this.postService.deletePost(id)
      .subscribe(() => {
        this.getPosts();
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
}

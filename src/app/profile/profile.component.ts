import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { SessionService } from '../session.service';
import { PostService } from '../post.service';
import { Post } from '../post';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User;
  posts: Post[] = [];

  get isCurrentUserPost() { return this.user.id === this.sessionService.currentUser.id };

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private postService: PostService,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.route.queryParams.subscribe(params => {
      const userId = params.id;
      this.sessionService.getUser(userId).subscribe(user => {
        this.user = user;
        this.getPosts();
      });
    });
  }

  getPosts(): void {
    this.postService.getPosts()
      .subscribe(posts => {
        // ユーザープロフィール画面に表示するのはそのユーザーの投稿のみ
        this.posts = posts.filter(v => v.userId === this.user.id)
          .sort((a, b) => b.createdAt - a.createdAt);
      });
  }

}

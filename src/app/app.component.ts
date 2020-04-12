import { Component } from '@angular/core';
import { SessionService } from './session.service';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mimitter';

  constructor(
    private sessionService: SessionService,
  ) {
    // ルートコンポーネントはどのページを生成する時でも読み込まれるので、ここでログイン状態を確認
    this.sessionService.checkLogin();
  }
}

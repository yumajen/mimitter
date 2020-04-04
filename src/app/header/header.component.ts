import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogined = false;

  constructor(
    private sessionService: SessionService,
  ) { }

  ngOnInit(): void {
    this.setSessionState();
  }

  setSessionState(): void {
    this.sessionService.sessionState.subscribe(v => {
      this.isLogined = v;
    });
  }

  logout(): void {
    this.sessionService.logout();
  }

}

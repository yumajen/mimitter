import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { Session } from '../session';
import { User } from '../user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogined = false;
  currentUser: User;

  constructor(
    private router: Router,
    private sessionService: SessionService,
  ) { }

  ngOnInit(): void {
    this.setSessionState();
  }

  setSessionState(): void {
    this.sessionService.sessionState.subscribe((session: Session) => {
      if (session) {
        this.isLogined = session.isLogined;
        this.currentUser = session.user;
      }
    });
  }

  logout(): void {
    this.sessionService.logout()
      .then(message => {
        alert(message);
        this.router.navigate(['/login']);
      })
      .catch(error => {
        alert(error);
      });
  }

}

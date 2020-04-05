import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogined = false;

  constructor(
    private router: Router,
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

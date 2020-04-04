import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private sessionService: SessionService,
  ) { }

  ngOnInit() {
  }

  login() {
    this.sessionService.login();
    this.router.navigate(['/main']);
  }

}

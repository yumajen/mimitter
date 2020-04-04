import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form = this.fb.group({
    email: [''],
    password: [''],
  });

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

  login() {
    const account = {
      email: this.form.get('email').value,
      password: this.form.get('password').value,
    };

    this.sessionService.login(account)
      .then(message => {
        alert(message);
        this.router.navigate(['/main']);
      })
      .catch(error => {
        alert(error);
      });
  }

}

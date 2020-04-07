import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form = this.fb.group({
    email: [''],
    password: [''],
    passwordConfirmation: [''],
  });

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  signup() {
    const account = {
      email: this.form.get('email').value,
      password: this.form.get('password').value,
    };
    if (account.password !== this.form.get('passwordConfirmation').value) {
      alert('入力されたパスワードが一致していません。');
      return;
    }

    this.sessionService.signup(account)
      .then(message => {
        alert(message);
        this.router.navigate(['/login']);
      })
      .catch(error => { alert(error); });
  }

}

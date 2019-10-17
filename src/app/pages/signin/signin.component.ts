import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const data = this.form.value;
      this.authService.signin(data).then(result => {
        if (result.success) {
          localStorage.setItem('user', JSON.stringify(result.data.user));
          localStorage.setItem('token', result.data.token);
          this.router.navigateByUrl('/');
        }
      });
    }
  }
}

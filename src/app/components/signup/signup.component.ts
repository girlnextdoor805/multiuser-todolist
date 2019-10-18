import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Form, FormGroup } from '@angular/forms';
import { JexiaService } from 'src/app/services/jexia.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private jexiaService: JexiaService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [null],
      password: [null],
      confirm: [null],
    }, {})
  }

  signup() {
    // this.router.navigate(['todo'])
    const user = this.form.value;
    delete user.confirm;
    this.authService.signUp(user).subscribe(response => {
      console.log(response)
    })
    // this.jexiaService.signup(user).subscribe(response => {
    //   console.log(response)
    // })
  }

}

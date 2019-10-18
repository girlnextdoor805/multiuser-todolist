import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JexiaService } from 'src/app/services/jexia.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private jexia: JexiaService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [null],
      password: [null],
    })
  }

  authenticate() {
    
    this.authService.authenticate(this.form.value).subscribe(response => {
      console.log(response)
      this.router.navigate(['todo'])
    })
  }

}

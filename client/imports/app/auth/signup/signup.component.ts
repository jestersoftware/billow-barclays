import { Accounts } from 'meteor/accounts-base';

import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { moveIn, fallIn } from './../../router.animations';

import template from "./signup.component.html";
import style from './signup.component.scss';

@Component({
  selector: 'app-signup',
  template,
  styles: [style],
  // templateUrl: './signup.component.html',
  // styleUrls: ['./signup.component.css'],
  animations: [moveIn(), fallIn()],
  host: {'[@moveIn]': ''}
})
export class SignupComponent implements OnInit {

  state: string = '';
  error: any;

  constructor(private router: Router) {
  }

  onSubmit(formData) {
    if(formData.valid) {
      // console.log(formData.value);

      Accounts.createUser({
        email: formData.value.email,
        password: formData.value.password
      }, (err) => {
        if (err) {
          // this.zone.run(() => {
          this.error = err;
          this.router.navigate(['/login']);
          // });
        } else {
          this.router.navigate(['/admin']);
        }
      });

    }
  }

  ngOnInit() {
  }

}

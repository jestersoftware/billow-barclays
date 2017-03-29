import { Accounts } from 'meteor/accounts-base';

import { Component, OnInit, NgZone, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { moveIn, fallIn } from './../../router.animations';

import template from './signup.component.html';
import style from './signup.component.scss';

@Component({
  selector: 'app-signup',
  template,
  styles: [style],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class SignupComponent implements OnInit {

  state: string = '';
  error: any;

  constructor(private router: Router, private zone: NgZone) {
  }

  ngOnInit() {
    // Didn't work to clear form from autofill
    // console.log(this.form);

    // setTimeout(() => {
    //   this.zone.run(() => {
    //     try {
    //       this.form.value.email = "";
    //       this.form.value.password = "";
    //     }
    //     catch (e) {
    //       console.log(e);
    //     }
    //   });
    // }, 1000);
  }

  onSubmit(formData) {
    if (formData.valid) {
      Accounts.createUser({
        email: formData.value.email,
        password: formData.value.password
      }, (err) => {
        if (err) {
          this.zone.run(() => {
            this.error = err;
            this.router.navigate(['/login']);
          });
        } else {
          this.router.navigate(['/admin']);
        }
      });
    }
  }
}

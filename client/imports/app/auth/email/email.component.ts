import { Meteor } from 'meteor/meteor';

import { Component, OnInit, NgZone } from '@angular/core';

import { Router } from '@angular/router';

import { moveIn, fallIn } from './../../router.animations';

import template from "./email.component.html";
import style from './email.component.scss';

@Component({
  selector: 'app-email',
  template,
  styles: [style],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class EmailComponent implements OnInit {

  state: string = '';
  error: any;

  constructor(private router: Router, private zone: NgZone) {
  }

  onSubmit(formData) {
    if (formData.valid) {
      Meteor.loginWithPassword(formData.value.email, formData.value.password, (err) => {
        this.zone.run(() => {
          if (err) {
            this.error = err;
          } else {
            this.router.navigate(['/admin']);
          }
        });
      });
    }
  }

  ngOnInit() {
  }
}

import { Component, OnInit, HostBinding } from '@angular/core';

import { Router } from '@angular/router';

import { moveIn, fallIn } from './../../router.animations';

import template from "./login.component.html";
import style from './login.component.scss';

@Component({
  selector: 'app-login',
  template,
  styles: [style],
  // templateUrl: './login.component.html',
  // styleUrls: ['./login.component.scss'],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class LoginComponent implements OnInit {

  error: any;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  loginFb() {
    // this.angularFire.auth.login({
    //   provider: AuthProviders.Facebook,
    //   method: AuthMethods.Popup,
    // }).then(
    //   (success) => {
    //   this.router.navigate(['/home']);
    // }).catch(
    //   (err) => {
    //   this.error = err;
    // })
  }

  loginGoogle() {
    // this.angularFire.auth.login({
    //   provider: AuthProviders.Google,
    //   method: AuthMethods.Popup,
    // }).then(
    //   (success) => {
    //   this.router.navigate(['/home']);
    // }).catch(
    //   (err) => {
    //   this.error = err;
    // })
  }

}
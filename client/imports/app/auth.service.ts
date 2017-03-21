import { Meteor } from 'meteor/meteor';

import { CanActivate, Router } from '@angular/router';
import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { 
  }

  canActivate(): Observable<boolean> {
    return Observable.from([  !!Meteor.userId() ])
      .do(authenticated => {
        if (!authenticated) this.router.navigate(['/login']);
      });
  }
}

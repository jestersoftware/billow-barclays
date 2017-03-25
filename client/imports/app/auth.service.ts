import { Meteor } from 'meteor/meteor';

import { CanActivate, Router } from '@angular/router';
import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { ThingService } from './thing.service';

@Injectable()
export class AuthGuard implements CanActivate {

  routed = false;

  constructor(
    private router: Router,
    private thingService: ThingService) {
  }

  canActivate(): Observable<boolean> {
    // console.log(this.router);

    return Observable.from([!!Meteor.userId()])
      .do(authenticated => {
        if (!authenticated) {
          // console.log(window.location.hostname);

          this.thingService.getThingsByQuery({ domain: { url: window.location.hostname } }).subscribe(things => {
            if (things.length > 0) {
              this.routed = true;
              this.router.navigate([things[0]._id]);
            }
            else {
              this.router.navigate(['/login']);
            }
          }, 
          (error) => { 
            this.router.navigate(['/login']); 
          }, 
          () => { 
            if(!this.routed)
            this.router.navigate(['/login']); 
          });
        }
      });
  }
}

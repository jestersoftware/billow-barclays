import { Meteor } from 'meteor/meteor';

import { CanActivate, Router } from '@angular/router';
import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { ThingService } from './thing.service';

@Injectable()
export class AuthService2 implements CanActivate {

  routed = false;

  constructor(
    private router: Router,
    private thingService: ThingService) {
  }

  canActivate(): Observable<boolean> {
    return Observable.from([!!Meteor.userId()])
      .do(authenticated => {
        this.thingService.getThingsByQuery({ domain: { url: window.location.hostname } }).subscribe(things => {
          if (things.length > 0) {
            this.routed = true;
            this.router.navigate([things[0]._id]);
            document.title = things[0].title; // TODO
          }
          else {
            if (!authenticated) {
              this.router.navigate(['/login']);
            }
            else {
              this.routed = true;
              this.router.navigate(['/admin']);
            }
          }
        },
          (error) => {
            this.router.navigate(['/login']);
          },
          () => {
            if (!this.routed)
              this.router.navigate(['/login']);
          });
      });
  }
}

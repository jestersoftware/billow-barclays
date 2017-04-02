import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { MeteorObservable } from "meteor-rxjs";


@Injectable()
export class ViewService {

  private views: any = {};

  private viewsChanged = new Subject<string>();

  viewsChanged$ = this.viewsChanged.asObservable();

  constructor() {
  }

  update(thing) {
    MeteorObservable.call('users.update.view', thing).subscribe({
      next: () => {
      },
      error: (e: Error) => {
        console.log('ViewService.update() error', e);
      }
    });
  }

  setCurrentView(views) {
    this.views = views;

    this.viewsChanged.next(this.views);
  }

  getCurrentView() {
    return this.views;
  }
}
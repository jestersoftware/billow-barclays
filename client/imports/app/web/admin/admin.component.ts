import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import {
  Component,
  OnInit,
  Input,
  ElementRef,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';

import { Router } from '@angular/router';

import { MdSnackBar } from '@angular/material';

import { ViewService } from './../../view.service';

import template from "./admin.component.html";
import style1 from './admin.component.scss';

import * as anime from "animejs";

@Component({
  selector: 'app-admin',
  template,
  styles: [style1]
})
export class AdminComponent implements OnInit {

  user: any;
  userId: string;
  parent: Object;

  mouseY = 0;
  moving = false;
  animation: any;
  timeout = false;

  choosing: any;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private viewService: ViewService,
    private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.userId = Meteor.userId();

    if (!this.userId)
      this.router.navigate(['/login']);

    Tracker.autorun(() => {
      this.user = Meteor.user();
      if (this.user && this.user.views) {
        this.viewService.setCurrentView(this.user.views);
      }
    });

    this.parent = { _id: "", title: "Root", type: "Root", session: {} };
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    Meteor.logout();
    this.router.navigate(['/login']);
  }

  onClickLeft(event) {
    this.cancelMovement();

    this.setPosition({ event: null, thing: this.parent }, this.moveLeft, 0, 0.6);
  }

  onClickRight(event) {
    this.cancelMovement();

    this.setPosition({ event: null, thing: this.parent }, this.moveRight, 0, 0.6);
  }

  onLeftMouseMove(event) {
    this.mouseY = event.y;

    if (!this.timeout) {
      this.timeout = true;
      this.moving = true;

      setTimeout(() => {
        if (this.moving)
          this.setPosition({ e: event, event: null, thing: this.parent }, this.moveLeft, 300, 0.6);
        else
          this.timeout = false;
      }, 250);
    }
  }

  onRightMouseMove(event) {
    this.mouseY = event.y;

    if (!this.timeout) {
      this.timeout = true;
      this.moving = true;

      setTimeout(() => {
        if (this.moving)
          this.setPosition({ e: event, event: null, thing: this.parent }, this.moveRight, 300, 0.6);
        else
          this.timeout = false;
      }, 250);
    }
  }

  onLeftMouseEnter(event) {
    // this.moving = true;

    // setTimeout(() => {
    //   if (this.moving)
    //     this.setPosition({ e: event, event: null, thing: this.parent }, this.moveLeft, 300, 0.6);
    // }, 250);
  }

  onRightMouseEnter(event) {
    // this.moving = true;

    // setTimeout(() => {
    //   if (this.moving)
    //     this.setPosition({ e: event, event: null, thing: this.parent }, this.moveRight, 300, 0.6);
    // }, 250);
  }

  onMouseLeave(event) {
    this.cancelMovement();
  }

  requests: any = [];

  doResize(event) {

    // if (this.movingTestLeft(event)) {
    //   this.setPosition(event, this.moveLeft, 0, this.movingTestLeft, 0, 'easeInQuad'/*, 300*/);
    // }
    // else if (this.movingTestRight(event)) {
    //   this.setPosition(event, this.moveRight, 0, this.movingTestRight, 0, 'easeInQuad'/*, 300*/);
    // }
    // else {
    //   this.setPosition(event, this.moveLeft, 0, this.movingTestLeft, 0, 'easeInQuad'/*, 300*/);
    // }

    this.requests.push(event);

    // console.log(event.event);

    let timeout = 500;
    let scale = 1;

    // // TEMP?
    // if (event.eventType === "load") {
    //   return;
    // }

    // if (event.eventType === "focus") {
    if (event.eventType !== "load") {
      timeout = 0;
    }

    if (event.eventType === "lookupThing") {
      scale = 0.6;
      this.choosing = event;
      const snackBarRef = this.snackBar.open('Choose a thing to refer to', 'Cancel');
      snackBarRef.onAction().subscribe(() => {
        // Choosing was canceled
        this.setPosition(this.choosing, this.moveCenter, 0);
        this.choosing = null;
      });
    }

    if (event.eventType === "chooseThing") {
      this.snackBar._openedSnackBarRef.dismiss();
      this.choosing = null;
    }

    setTimeout((length) => {
      if (this.requests.length > 0 && this.requests.length <= length) {
        let ev = this.requests[this.requests.length - 1];
        // if(!ev)
        //   debugger;
        this.setPosition(ev, this.moveCenter, 0, scale /*[1.0, 0.6, 1.0]*/ /*, 300*/);
        this.requests = [];
      }
    }, timeout, this.requests.length);
  }

  moveCenter(positionNumberStart, widthOfThing, widthOfContainer, scale) {
    let positionEnd = (widthOfContainer / 2) + (widthOfThing / -2);
    return positionEnd;
  }

  moveLeft(positionNumberStart, widthOfThing, widthOfContainer, scale) {
    let factor = positionNumberStart + (500 * (1 + scale));
    if (factor >= 0) return 0;
    return factor;
  }

  moveRight(positionNumberStart, widthOfThing, widthOfContainer, scale) {
    let factor = positionNumberStart - 500;
    let min = (widthOfContainer - widthOfThing) + (widthOfThing - (widthOfThing * scale));
    if (factor <= min) return min;
    return factor;
  }

  // movingTestLeft(event) {
  //   return event.elementRef.nativeElement.getBoundingClientRect().left < 0;
  // }

  // movingTestRight(event) {
  //   return event.elementRef.nativeElement.getBoundingClientRect().left > event.elementRef.nativeElement.ownerDocument.defaultView.innerWidth;
  // }

  cancelMovement() {
    this.moving = false;
    this.timeout = false;
    if (this.animation) {
      this.animation.pause();
      this.animation = null;
    }
  }

  setPosition(event: any, calc: Function, timeout: number, scale: number = 1, test: Function = null, easing: String = 'easeOutQuad') {

    let scroller = this.elementRef.nativeElement.querySelector('.scrollable');

    let thing = this.elementRef.nativeElement.querySelector('app-admin-thing');

    let widthOfContainer = scroller.clientWidth;
    let heightOfContainer = scroller.clientHeight;

    let div = this.elementRef.nativeElement.querySelector('app-admin-thing > div');
    let widthOfThing = div.clientWidth;
    let heightOfThing = div.clientHeight;

    let positionNumberStart = parseInt(thing.style.left.substr(0, thing.style.left.length - 1));
    let positionNumberEnd = 0;

    let upOrDown = event.e ? ((this.mouseY - (heightOfContainer / 2)) / (heightOfContainer / 4)) * 400 : 0;

    let scrollEnd = Math.min(heightOfThing, Math.max(0, scroller.scrollTop + upOrDown));
    // console.log('scrollEnd', scrollEnd);

    let scaleX = !scale[0] ? scale : 1;
    // console.log('scaleX', scaleX);

    if (!event.event && event.eventType !== "focus" && widthOfThing * scaleX <= widthOfContainer) {
      positionNumberEnd = (widthOfContainer - (widthOfThing * scaleX)) / 2;
    }
    else {
      positionNumberEnd = calc(positionNumberStart, /*count,*/ widthOfThing, widthOfContainer, scaleX);

      if (event.event) {
        let thingElement = event.event;
        positionNumberEnd = (widthOfContainer / 2) - (thingElement.offsetLeft + (thingElement.clientWidth / 2));
        scrollEnd = Math.max(0, (thingElement.offsetTop * scaleX) - 200);
      }
    }

    positionNumberEnd = Math.floor(positionNumberEnd);

    if (positionNumberStart === positionNumberEnd && scroller.scrollTop === scrollEnd) {
      this.timeout = false;
      return;
    }

    if (this.animation) {
      this.animation.pause();
      console.log('animation paused');
    }

    console.log('Set Position due to Thing: ', event.thing.title, event);

    // let duration = Math.min(1000, 1000 - ((widthOfContainer / widthOfThing) * 1000));
    // let duration = 500;
    let duration = Math.abs((positionNumberEnd - positionNumberStart) / 2);

    let positionStart = positionNumberStart.toString();
    let positionEnd = positionNumberEnd.toString();

    let leftStart = positionStart + "px";
    let leftEnd = positionEnd + "px";

    this.animation = anime.timeline();

    let positionAnimation = {
      targets: thing,
      // left: [leftStart, leftEnd],
      left: leftEnd,
      scale: scale,
      duration: 500,
      easing: easing,
      // elasticity: 600,
      offset: 0
    };

    let scrollAnimation = {
      targets: scroller,
      scrollTop: scrollEnd,
      duration: 250,
      easing: easing,
      offset: 0
    };

    this.animation
      .add(positionAnimation)
      .add(scrollAnimation);

    // this.animation.begin = function () {
    //   console.log('Animation beginning', positionAnimation, scrollAnimation);
    // };

    this.animation.finished.then(() => {
      setTimeout(() => {
        this.animation = null; // ???
        if (this.moving || (test && test(event))) {
          this.setPosition(event, calc, timeout, scale, test, easing /*'linear'*/);
        }
        this.timeout = false;
      }, 0);
    });
  }
}

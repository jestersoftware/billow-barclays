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

  moving = false;
  animation: any;

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

    this.setPosition({ event: null, thing: this.parent }, this.moveLeft, 0, null, 0, 'easeInQuad', 0.6 /*, 300*/);
  }

  onClickRight(event) {
    this.cancelMovement();

    this.setPosition({ event: null, thing: this.parent }, this.moveRight, 0, null, 0, 'easeInQuad', 0.6 /*, 300*/);
  }

  onLeftMouseEnter(event) {
    this.moving = true;

    setTimeout(() => {
      if (this.moving)
        this.setPosition({ event: null, thing: this.parent }, this.moveLeft, 300, null, 0, 'easeInQuad', 0.6 /*, 700*/);
    }, 250);
  }

  onRightMouseEnter(event) {
    this.moving = true;

    setTimeout(() => {
      if (this.moving)
        this.setPosition({ event: null, thing: this.parent }, this.moveRight, 300, null, 0, 'easeInQuad', 0.6 /*, 700*/);
    }, 250);
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

    if (event.eventType === "focus") {
      timeout = 0;
    }

    if (event.eventType === "lookupThing") {
      scale = 0.6;
      this.choosing = event;
      const snackBarRef = this.snackBar.open('Choose a thing to refer to', 'Cancel');
      snackBarRef.onAction().subscribe(() => {
        this.setPosition(this.choosing, this.moveCenter, 0, null, 0, 'easeInQuad', 1);
        this.choosing = null;
      });
    }

    if (event.eventType === "chooseThing") {
      this.snackBar._openedSnackBarRef.dismiss();
      this.choosing.thing.reference._id = event.thing._id; // TODO
      this.choosing.thing.title = event.thing.title; // TODO
      // this.choosing.thing.description = "Reference to " + event.thing.title; // TODO
      this.choosing = null;
    }

    setTimeout((length) => {
      if (this.requests.length <= length) {
        this.setPosition(this.requests[this.requests.length - 1], this.moveCenter, 0, null, 0, 'easeInQuad', scale /*[1.0, 0.6, 1.0]*/ /*, 300*/);
        this.requests = [];
      }
    }, timeout, this.requests.length);
  }

  moveCenter(positionNumberStart, count, widthOfThing, widthOfContainer, scale) {
    // let positionEnd = (widthOfContainer - widthOfThing) / 2;
    let positionEnd = (widthOfContainer / 2) + (widthOfThing / -2);
    return positionEnd;
  }

  moveLeft(positionNumberStart, count, widthOfThing, widthOfContainer, scale) {
    let factor = positionNumberStart + 500;
    if (factor >= 0) return 0;
    return factor;
  }

  moveRight(positionNumberStart, count, widthOfThing, widthOfContainer, scale) {
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
    if (this.animation) {
      this.animation.pause();
      this.animation = null;
    }
  }

  setPosition(event, calc, timeout, test, count, easing, scale /*, duration*/) {

    // console.log('set position');

    let scroller = this.elementRef.nativeElement.querySelector('.scrollable');

    let thing = this.elementRef.nativeElement.querySelector('app-admin-thing');

    let container = this.elementRef.nativeElement.querySelector('div');
    let widthOfContainer = container.clientWidth;

    let div = this.elementRef.nativeElement.querySelector('app-admin-thing > div');
    let widthOfThing = div.clientWidth;

    let positionNumberStart = parseInt(thing.style.left.substr(0, thing.style.left.length - 1));

    let positionNumberEnd = 0;

    let scrollEnd = scroller.scrollTop < 100 ? 0 : scroller.scrollTop * scale;

    // console.log('Scroll end: ' + scrollEnd);

    let scaleX = !scale[0] ? scale : 1;

    // console.log('ScaleX: ' + scaleX);

    if (event.eventType !== "focus" && widthOfThing * scaleX <= widthOfContainer) {
      positionNumberEnd = (widthOfContainer - (widthOfThing * scaleX)) / 2;
    }
    else {
      positionNumberEnd = calc(positionNumberStart, count, widthOfThing, widthOfContainer, scaleX);

      // console.log('Original end: ' + positionNumberEnd);

      if (event.event) {
        let thingElement = event.event;
        positionNumberEnd = (widthOfContainer / 2) - (thingElement.offsetLeft + (thingElement.clientWidth / 2));

        // console.log('Offset: ' + thingElement.offsetLeft, thingElement);
        // console.log('Width: ' + thingElement.clientWidth);

        scrollEnd = Math.max(0, thingElement.offsetTop - 200);
      }
    }

    positionNumberEnd = Math.floor(positionNumberEnd);

    if (positionNumberStart === positionNumberEnd && scroller.scrollTop === scrollEnd) return;

    if (this.animation) this.animation.pause();

    // console.log('Width of thing: ' + widthOfThing);
    // console.log('Start: ' + positionNumberStart);
    // console.log('End: ' + positionNumberEnd);
    // console.log('Set Position due to Thing: ' + event.thing.title);

    // let duration = Math.min(1000, 1000 - ((widthOfContainer / widthOfThing) * 1000));
    // let duration = 500;
    let duration = Math.abs((positionNumberEnd - positionNumberStart) / 2);
    // console.log(duration);

    let positionStart = positionNumberStart.toString();
    let positionEnd = positionNumberEnd.toString();

    let leftStart = positionStart + "px";
    let leftEnd = positionEnd + "px";

    count = count + 1;

    this.animation = anime.timeline();

    this.animation
      .add({
        targets: thing,
        left: [leftStart, leftEnd],
        scale: scale,
        duration: 400,
        easing: easing,
        offset: 0
      })
      .add({
        targets: scroller,
        scrollTop: scrollEnd,
        duration: 400,
        easing: easing,
        offset: 0
      });

    // this.animation.begin =  function() { console.log('began'); };

    this.animation.finished.then(() => {
      setTimeout(() => {
        this.animation = null;
        if (this.moving || (test && test(event))) {
          this.setPosition(event, calc, timeout, test, count, 'linear', scale /*, 300*/);
        }
      }, 0);
    });
  }
}

import { Meteor } from 'meteor/meteor';

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

import { InjectUser } from "angular2-meteor-accounts-ui";

import template from "./admin.component.html";
import style1 from './admin.component.scss';

import * as anime from "animejs";
// import anime from 'animejs';

@Component({
  selector: 'app-admin',
  template,
  styles: [style1]
})
@InjectUser('user')
export class AdminComponent implements OnInit {

  auth: any;
  parent: any;
  elementRef: ElementRef;

  isMoving = false;

  animation: any;
  scale: any = 1;

  constructor(private router: Router, elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  ngOnInit() {
    if(!Meteor.userId())
      this.router.navigate(['/login']);
    
    this.auth = { _id: Meteor.userId() };
    this.parent = { title: "Root", type: "Root" };
  }

  login() {
    // Meteor.logout();
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
    this.isMoving = true;

    setTimeout(() => {
      if (this.isMoving)
        this.setPosition({ event: null, thing: this.parent }, this.moveLeft, 300, null, 0, 'easeInQuad', 0.6 /*, 700*/);
    }, 250);
  }

  onRightMouseEnter(event) {
    this.isMoving = true;

    setTimeout(() => {
      if (this.isMoving)
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

    if (event.eventType === "focus")
      timeout = 0;

    setTimeout((length) => {
      if (this.requests.length > length) {
      }
      else {
        //console
        this.setPosition(this.requests[this.requests.length - 1], this.moveCenter, 0, null, 0, 'easeInQuad', 1 /*[1.0, 0.6, 1.0]*/ /*, 300*/);

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
    this.isMoving = false;
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

    let scrollEnd = scroller.scrollTop * scale;

    // console.log('*******');

    let scalexx = !scale[0] ? scale : 1;

    // console.log('scalexx' + scalexx);

    if (widthOfThing * this.scale <= widthOfContainer) {
      positionNumberEnd = (widthOfContainer - (widthOfThing * this.scale)) / 2;
      // scale = 1;
    }
    else {
      positionNumberEnd = calc(positionNumberStart, count, widthOfThing, widthOfContainer, scalexx);

      // console.log('original end: ' + positionNumberEnd);

      if (event.event) {
        let el = event.event;
        positionNumberEnd = (widthOfContainer / 2) - (el.offsetLeft + (el.clientWidth / 2));

        // console.log('offset: ' + el.offsetLeft, el);
        // console.log('width: ' + el.clientWidth);

        scrollEnd = Math.max(0, el.offsetTop - 200);
      }
    }

    if (positionNumberStart === positionNumberEnd && scroller.scrollTop === scrollEnd) return;

    // if (this.animation) return;
    if (this.animation) this.animation.pause();

    // console.log('width of thing: ' + widthOfThing);
    // console.log('Start: ' + positionNumberStart);
    // console.log('End: ' + positionNumberEnd);

    // console.log('Set Position due to Thing: ' + event.thing.title);

    ///////////////
    // let duration = Math.min(1000, 1000 - ((widthOfContainer / widthOfThing) * 1000));
    let duration = Math.abs((positionNumberEnd - positionNumberStart) / 2);
    // console.log(duration);
    // let duration = 500;
    ///////////////

    let positionStart = positionNumberStart.toString();
    let positionEnd = positionNumberEnd.toString();

    let leftStart = positionStart + "px";
    let leftEnd = positionEnd + "px";

    count = count + 1;

    // console.log(scale);

    if (scrollEnd && scrollEnd > 0) {

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
    }
    else {
      this.animation = anime({
        targets: thing,
        left: [leftStart, leftEnd],
        scale: scale,
        duration: 400,
        easing: easing //,
        // delay: 100
      });
    }

    // this.animation.begin =  function() { console.log('began'); };

    this.animation.finished.then(() => {
      this.scale = scalexx;
      // console.log("animation finished with scale " + this.scale);
      setTimeout(() => {
        this.animation = null;
        if (this.isMoving || (test && test(event))) {
          this.setPosition(event, calc, timeout, test, count, 'linear', scale /*, 300*/);
        }
      }, 0);
    });
  }
}

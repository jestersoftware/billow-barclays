import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { Component, OnInit, Input, ElementRef /*, trigger, state, style, transition, animate*/ } from '@angular/core';

import { Router } from '@angular/router';

import { MdSnackBar } from '@angular/material';

import { ViewService } from './../../view.service';

import template from "./admin.component.html";
import style1 from './admin.component.scss';

import * as anime from "animejs";
import * as interact from "interactjs";

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
  // dragging: any;
  animation: any;
  timeout = false;

  choosing: any;

  requests: any = [];

  scroller: any;

  rootThingElement: any;

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

    this.scroller = this.elementRef.nativeElement.querySelector('.scrollable');

    this.parent = { _id: "", title: "Root", type: "Root", session: {} };

    Tracker.autorun(() => {
      this.user = Meteor.user();
      if (this.user && this.user.views) {
        this.viewService.setCurrentView(this.user.views);
      }
    });

    let abc = interact(".draggable")
      .draggable({
        // enable inertial throwing
        inertia: true,
        // // keep the element within the area of it's parent
        // restrict: {
        //   restriction: "parent",
        //   endOnly: true,
        //   elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        // },
        // // enable autoScroll
        // autoScroll: true,
        // styleCursor: false,

        // call this function on every dragmove event
        onmove: this.dragMoveListener,
        // call this function on every dragend event
        // onend: function (event) {
        //   var textEl = event.target.querySelector('p');

        //   textEl && (textEl.textContent =
        //     'moved a distance of '
        //     + (Math.sqrt(event.dx * event.dx +
        //                 event.dy * event.dy)|0) + 'px');
        // }
      });
   
    abc.options.styleCursor = false;
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    Meteor.logout();
    this.router.navigate(['/login']);
  }

  // onMouseDownDesktop(event) {
  //   console.log('mousedown', event);

  //   if (event.srcElement.className.indexOf("thing") < 0)
  //     return;

  //   // event.stopPropagation();

  //   this.dragging = event;
  // }

  // onMouseUpDesktop(event) {
  //   console.log('mouseup');

  //   // event.stopPropagation();

  //   this.dragging = null;
  // }

  // onMouseMoveDesktop(event) {
  //   // event.stopPropagation();

  //   if (this.dragging && !this.timeout) {

  //     this.timeout = true;

  //     let amountMoved = event.x - this.dragging.x;

  //     console.log('mousemove', amountMoved);

  //     // if (amountMoved >= 0)
  //     this.setPosition({ event: null, thing: this.parent, eventType: 'drag' }, amountMoved /*this.dragLeft*/, 0, 1);
  //     // else
  //     // this.setPosition({ event: null, thing: this.parent, eventType: 'drag' }, amountMoved/*this.dragRight*/, 0, 1);

  //     this.dragging = event;
  //   }
  //   else {
  //     console.log('mousemove skipped');
  //   }
  // }

  dragMoveListener (event) {
    let target = event.target; //,
        // keep the dragged position in the data-x/data-y attributes
        // x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx/*,
        // y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy*/;

    if (event.interaction.downEvent.target.className.indexOf("thing") < 0)
      return;

    // console.log(event);

    let x = parseInt(target.style.left) + event.dx;

    // translate the element
    // target.style.webkitTransform =
    // target.style.transform =
    //   'translate(' + x + 'px, ' + y + 'px)';
    target.style.left = x + 'px';

    // update the posiion attributes
    // target.setAttribute('data-x', x);
    // target.setAttribute('data-y', y);
  }

  onClickLeft(event) {
    this.cancelMovement();

    this.setPosition({ event: null, thing: this.parent }, this.moveLeft, 0, 0.7);
  }

  onClickRight(event) {
    this.cancelMovement();

    this.setPosition({ event: null, thing: this.parent }, this.moveRight, 0, 0.7);
  }

  onMouseMoveLeft(event) {
    if (!this.timeout) {
      this.timeout = true;
      this.moving = true;

      setTimeout(() => {
        if (this.moving)
          this.setPosition({ mouseY: event.y, event: null, thing: this.parent }, this.moveLeft, 500, 0.7);
        else
          this.timeout = false;
      }, 500);
    }
  }

  onMouseMoveRight(event) {
    if (!this.timeout) {
      this.timeout = true;
      this.moving = true;

      setTimeout(() => {
        if (this.moving)
          this.setPosition({ mouseY: event.y, event: null, thing: this.parent }, this.moveRight, 500, 0.7);
        else
          this.timeout = false;
      }, 500);
    }
  }

  onMouseLeave(event) {
    this.cancelMovement();
  }

  moveCenter(positionNumberStart, widthOfThing, widthOfContainer, scale) {
    let positionEnd = (widthOfContainer / 2) + (widthOfThing / -2);
    return positionEnd;
  }

  // dragLeft(positionNumberStart, widthOfThing, widthOfContainer, scale) {
  //   let factor = positionNumberStart + 100;
  //   return factor;
  // }

  // dragRight(positionNumberStart, widthOfThing, widthOfContainer, scale) {
  //   let factor = positionNumberStart - 100;
  //   return factor;
  // }

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

    let timeout = 700;
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
    else if (event.eventType === "chooseThing") {
      this.snackBar._openedSnackBarRef.dismiss();
      this.choosing = null;
    }

    setTimeout((length) => {
      if (this.requests.length > 0 && this.requests.length <= length) {
        let ev = this.requests[this.requests.length - 1];
        this.setPosition(ev, this.moveCenter, 0, scale /*[1.0, 0.6, 1.0]*/ /*, 300*/);
        this.requests = [];
      }
    }, timeout, this.requests.length);
  }

  setPosition(event: any, calc: any, timeout: number, scale: number = 1, test: Function = null, easing: String = 'easeOutQuad') {

    let thing = this.elementRef.nativeElement.querySelector('app-admin-thing');

    let widthOfContainer = this.scroller.clientWidth;
    let heightOfContainer = this.scroller.clientHeight;

    // let div = this.elementRef.nativeElement.querySelector('app-admin-thing > div');
    if (!this.rootThingElement)
      this.rootThingElement = this.elementRef.nativeElement.querySelector('.thing.root');

    let widthOfThing = this.rootThingElement.clientWidth;
    let heightOfThing = this.rootThingElement.clientHeight;

    // console.log('widthOfContainer', widthOfContainer, 'widthOfThing', widthOfThing);

    let positionNumberStart = parseInt(thing.style.left.substr(0, thing.style.left.length - 1));
    let positionNumberEnd = 0;

    let upOrDown = event.mouseY ? ((event.mouseY - (heightOfContainer / 2)) / (heightOfContainer / 4)) * 400 : 0;

    let scrollEnd = Math.min(heightOfThing, Math.max(0, this.scroller.scrollTop + upOrDown));
    // console.log('scrollEnd', scrollEnd);

    let scaleX = !scale[0] ? scale : 1;
    // console.log('scaleX', scaleX);

    if (!event.event && event.eventType !== "focus" && event.eventType !== "drag" && widthOfThing * scaleX <= widthOfContainer) {
      positionNumberEnd = (widthOfContainer - (widthOfThing * scaleX)) / 2;
    }
    else {
      positionNumberEnd = typeof calc === "function" ? calc(positionNumberStart, widthOfThing, widthOfContainer, scaleX) : positionNumberStart + calc;

      if (event.event) {
        let thingElement = event.event;
        positionNumberEnd = (widthOfContainer / 2) - (thingElement.offsetLeft + (thingElement.clientWidth / 2));
        if(thingElement.offsetTop > (this.scroller.scrollTop + (heightOfContainer / 3.5))) {
          scrollEnd = Math.max(0, (thingElement.offsetTop * scaleX) - 200);
        }
      }
    }

    positionNumberEnd = Math.floor(positionNumberEnd);

    if (positionNumberStart === positionNumberEnd && this.scroller.scrollTop === scrollEnd) {
      this.timeout = false;
      return;
    }

    if (this.animation) {
      this.animation.pause();
      // console.log('animation paused');
    }

    // console.log('Set Position due to Thing: ', event.thing.title, event);

    // let duration = Math.min(1000, 1000 - ((widthOfContainer / widthOfThing) * 1000));
    let duration = 600;
    // let duration = Math.abs((positionNumberEnd - positionNumberStart) / 2);

    let positionStart = positionNumberStart.toString();
    let positionEnd = positionNumberEnd.toString();

    let leftStart = positionStart + "px";
    let leftEnd = positionEnd + "px";

    this.animation = anime.timeline();

    let positionAnimation = {
      targets: thing,
      left: leftEnd,
      scale: scale,
      duration: duration,
      easing: easing,
      offset: 0
    };

    let scrollAnimation = {
      targets: this.scroller,
      scrollTop: scrollEnd,
      duration: duration, // / 2,
      easing: easing,
      offset: 50
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

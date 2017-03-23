import { Component, OnInit, Input, Output, EventEmitter, ElementRef, NgZone } from '@angular/core';

import { SchemaService } from './../../schema.service';

import { ThingService } from './../../thing.service';

import template from "./admin-list.component.html";
import style from './admin-list.component.scss';

@Component({
  selector: 'app-admin-list',
  template,
  styles: [style]
})
export class AdminListComponent implements OnInit {

  @Input() auth: any;
  @Input() parent: any;
  @Output() onResize = new EventEmitter<any>();

  things: any = [];

  constructor(
    public elementRef: ElementRef,
    private schemaService: SchemaService,
    private thingService: ThingService,
    private zone: NgZone) {
  }

  ngOnInit() {
    if (this.auth) {
      this.thingService.getThings(this.parent).subscribe(things => {

        this.zone.run(() => {
          this.things = things;
          this.parent.childrenLength = this.things.length;
        });

        setTimeout(() => {
          let el = this.elementRef.nativeElement;
          while (el.parentElement && (el = el.parentElement) && !el.classList.contains('thing'));
          this.doResize({ event: el, thing: this.parent, eventType: "load", lastThing: this.parent });
        }, 0);

      });
    }
  }

  archetype(thing) {
    return this.schemaService.getArchetype(thing);
  }

  props(thing) {
    return this.schemaService.getProperties(thing);
  }

  click(event) {
    event.event.stopPropagation();

    let el = event.event.target;
    while (el.parentElement && (el = el.parentElement) && !el.classList.contains('thing'));

    this.doResize({ event: el, thing: this.parent, eventType: "focus", lastThing: event.thing });
  }

  edit(event) {
    event.event.stopPropagation();

    let thing = event.thing;

    if (!thing.session)
      thing.session = {};

    thing.session.disabled = !event.value;
  }

  save(event) {
    event.event.stopPropagation();

    let thing = event.thing;

    this.thingService.update(thing, this.auth._id);
  }

  create(event) {
    event.event.stopPropagation();

    let thing = event.thing;

    var param: any = {
      userId: this.auth._id,
      parent: thing._id,
      title: "(enter title)", //event.target.value
      type: event.event.target.parentElement.parentElement.innerText // TODO
    }

    if (thing.view) {
      param.view = thing.view;
    }

    this.thingService.insert(param);
  }

  getKey(index: number, item: any): number {
    return item._id;
  }

  doResize(event) {
    this.onResize.emit(event);
  }
}

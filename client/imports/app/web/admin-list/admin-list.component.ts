import { Component, OnInit, Input, Output, EventEmitter, ElementRef, NgZone } from '@angular/core';

import { SchemaService } from './../../schema.service';

import { ViewService } from './../../view.service';

import { ThingService } from './../../thing.service';

import template from "./admin-list.component.html";
import style from './admin-list.component.scss';

@Component({
  selector: 'app-admin-list',
  template,
  styles: [style],
  providers: [ThingService]
})
export class AdminListComponent implements OnInit {

  @Input() parent: any;
  @Input() reference: any = false;
  @Output() onResize = new EventEmitter<any>();

  things: any = [];

  constructor(
    public elementRef: ElementRef,
    private viewService: ViewService,
    private schemaService: SchemaService,
    private thingService: ThingService,
    private zone: NgZone) {
  }

  ngOnInit() {
    this.thingService.getChildren(this.parent).subscribe(things => {
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

  archetype(thing) {
    return this.schemaService.getArchetype(thing);
  }

  archetypes(thing) {
    return this.schemaService.getArchetypes(thing);
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

  toggleChildren(event) {
    // event.event.stopPropagation();

    if (!event.thing.view)
      event.thing.view = {};

    event.thing.view.showChildren = event.force ? true : !event.thing.view.showChildren;

    this.viewService.updateView(event.thing);

    // this.eventElement = this.getParentThingElement(event);
    // this.eventThing = event.thing;

    // if (!event.thing.view.showChildren) {
    //   setTimeout(() => {
    //     this.doResize({ event: this.eventElement, thing: this.eventThing, eventType: "toggleChildren", lastThing: this.eventThing });
    //     // this.eventElement = null;
    //   }, 0);
    // }
  }

  typeChange(thing) {
    this.schemaService.fixup([thing], false);
  }

  typeClick(event) {
    event.stopPropagation();
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

    this.thingService.update(thing);
  }

  create(event) {
    event.event.stopPropagation();

    let thing = event.thing;

    var param: any = {
      parent: thing._id,
      title: "(enter title)", //event.target.value
      type: event.type //.event.target.parentElement.parentElement.innerText // TODO
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

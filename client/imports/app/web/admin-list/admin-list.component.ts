import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef, NgZone } from '@angular/core';

import { SchemaService } from './../../schema.service';

import { ViewService } from './../../view.service';

import { AdminService } from './../../admin.service';

import { ThingService } from './../../thing.service';

import template from "./admin-list.component.html";
import style from './admin-list.component.scss';

@Component({
  selector: 'app-admin-list',
  template,
  styles: [style]
})
export class AdminListComponent implements OnInit, OnChanges {

  @Input() parent: any;
  @Input() editingParent: any = false;
  @Output() onResize = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onCount = new EventEmitter();

  things: any = [];

  editingReference: any = false;

  constructor(
    public elementRef: ElementRef,
    private viewService: ViewService,
    private schemaService: SchemaService,
    private adminService: AdminService,
    private thingService: ThingService,
    private zone: NgZone) {
  }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(simpleChanges) {
    if (simpleChanges.editingParent && simpleChanges.editingParent.previousValue === true && simpleChanges.editingParent.currentValue === false) {
      this.things = [];
      this.init();
    }
  }

  init() {
    this.adminService.getChildren(this.parent).subscribe(things => {
      this.things = things;
      this.onCount.emit({ thing: this.parent, count: this.things.length });

      setTimeout(() => {
        this.doResize(
          {
            event: this.thingService.getParentThingElement({ event: { target: this.elementRef.nativeElement } }),
            thing: this.parent,
            eventType: "load",
            lastThing: this.parent
          });
      }, 0);
    });
  }

  doCount(event) {
    this.things.forEach(thing => {
      if (thing._id === event.thing._id) {
        // Use timeout, Otherwise there's an error - "Expression has changed after it was checked"
        setTimeout(() => {
          thing.session.childrenLength = event.count;
        }, 0);
      }
    });
  }

  getArchetype(thing) {
    return this.schemaService.getArchetype(thing);
  }

  getArchetypes(thing) {
    return this.schemaService.getArchetypes(thing);
  }

  getProperties(thing) {
    return this.schemaService.getProperties(thing);
  }

  click(event) {
    event.event.stopPropagation();

    this.doResize(
      {
        event: this.thingService.getParentThingElement(event),
        thing: this.parent,
        eventType: "focus",
        lastThing: event.thing
      });
  }

  toggleChildren(event) {
    event.event.stopPropagation();

    if (!event.thing.view) {
      event.thing.view = {};
    }

    event.thing.view.showChildren = event.force ? true : !event.thing.view.showChildren;

    this.viewService.update(event.thing);
  }

  typeChange(thing) {
    this.schemaService.fixup([thing], false);
  }

  typeClick(event) {
    event.stopPropagation();
  }

  edit(event) {
    event.event.stopPropagation();

    if (this.parent.type === 'Reference') {
      event.thing.session.editing = false;
      event.thing = this.parent;
      this.editingParent = event.value;
      this.onEdit.emit(event);
      return;
    }

    if (event.thing.type === 'Reference') {
      event.thing.session.editing = event.value;
      this.editingReference = event.value;
    }

    event.thing.session.disabled = !event.value;
  }

  save(event) {
    event.event.stopPropagation();

    if (event.thing.type === 'Reference') {
      event.thing.session.editing = false;
      this.editingReference = false;
    }

    this.thingService.update(event.thing);
  }

  create(event) {
    event.event.stopPropagation();

    var param: any = {
      parent: event.thing._id,
      title: "(enter title)",
      type: event.type
    };

    this.thingService.insert(param);
  }

  delete(event) {
    event.event.stopPropagation();

    this.thingService.delete(event.thing);
  }  

  getId(index: number, item: any): number {
    return item._id;
  }

  doResize(event) {
    this.onResize.emit(event);
  }
}

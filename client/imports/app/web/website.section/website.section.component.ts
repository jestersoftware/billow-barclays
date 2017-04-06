import { Component, OnInit, NgZone, Input, Output, EventEmitter } from '@angular/core';

import { SchemaService } from './../../schema.service';

import { AdminService } from './../../admin.service';

import { ThingService } from './../../thing.service';

import template from "./website.section.component.html";
import style from './website.section.component.scss';

@Component({
  selector: 'app-website-section',
  template,
  styles: [style]
})
export class WebsiteSectionComponent implements OnInit {

  @Input() parent: any;
  @Input() level: number = 1;
  @Input() params: any = "";
  @Output() onResize = new EventEmitter();

  things: any = [];

  private timeout = false;

  constructor(
    private schemaService: SchemaService,
    private adminService: AdminService,
    private thingService: ThingService,
    private zone: NgZone) {
  }

  ngOnInit() {
  }

  ngOnChanges(simpleChanges) {
    if (simpleChanges["parent"]) {
      this.adminService.getChildren(this.parent).subscribe(things => {
        this.things = things;
      });

      this.onResize.emit();
    }
  }

  getId(index: number, item: any): number {
    return item._id;
  }

  getLink(event) {
    return ['/' + event.thing._id, { mode: event.type }];
  }

  getArchetype(thing) {
    return this.schemaService.getArchetype(thing);
  }

  getProperties(thing) {
    return this.schemaService.getProperties(thing).filter(property => {
      return !(property.hidden === true);
    });
  }
}

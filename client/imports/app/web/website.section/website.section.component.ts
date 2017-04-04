import { Component, OnInit, NgZone, Input, Output, EventEmitter } from '@angular/core';

// import { Router, ActivatedRoute, Params } from '@angular/router';

import { SchemaService } from './../../schema.service';

import { AdminService } from './../../admin.service';

import { ThingService } from './../../thing.service';

import template from "./website.section.component.html";
import style from './website.section.component.scss';

@Component({
  selector: 'app-website-section',
  template,
  styles: [style],
  providers: [ThingService]
})
export class WebsiteSectionComponent implements OnInit {

  @Input() parent: any;
  @Input() level: number = 1;
  @Input() params: any = "";
  @Output() onResize = new EventEmitter();

  things: any = [];

  private timeout = false;

  constructor(
    // private activatedRoute: ActivatedRoute,
    private schemaService: SchemaService,
    private adminService: AdminService,
    private thingService: ThingService,
    private zone: NgZone) {
  }

  ngOnInit() {
    console.log('params', this.params);

    this.adminService.getChildren(this.parent).subscribe(things => {
      this.zone.run(() => {
        this.things = things;
      });
    });

    // this.activatedRoute.params.subscribe((params: Params) => {
    //   console.log('section', params);
    // });

    this.onResize.emit();
  }

  getId(index: number, item: any): number {
    return item._id;
  }

  getLink(event) {
    return ['/' + event.thing._id, { mode: event.type} ];
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

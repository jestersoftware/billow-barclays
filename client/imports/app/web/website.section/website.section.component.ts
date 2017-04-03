import {
  Component,
  OnInit,
  NgZone,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

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
    this.adminService.getChildren(this.parent).subscribe(things => {
      this.zone.run(() => {
        this.things = things;
      });
    });

    this.onResize.emit();
  }

  getKey(index: number, item: any): number {
    return item._id;
  }

  archetype(thing) {
    return this.schemaService.getArchetype(thing);
  }

  props(thing) {
    return this.schemaService.getProperties(thing);
  }
}

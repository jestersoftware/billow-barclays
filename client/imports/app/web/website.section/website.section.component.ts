import {
  Component,
  OnInit,
  NgZone,
  Input
} from '@angular/core';

import { SchemaService } from './../../schema.service';

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

  things: any = [];

  constructor(
    private schemaService: SchemaService,
    private thingService: ThingService, 
    private zone: NgZone) {
  }

  ngOnInit() {
    this.thingService.getThings(this.parent).subscribe(things => {
      this.zone.run(() => {
        this.things = things;

        // console.log(this.parent.title, this.parent._id, this.things);

      });
    });
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

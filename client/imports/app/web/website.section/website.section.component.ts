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
    let thing = { 
      _id: this.parent.reference && this.parent.reference._id ? this.parent.reference._id : this.parent._id 
    };
    
    this.thingService.getThings(thing).subscribe(things => {
      this.zone.run(() => {
        this.things = things;
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

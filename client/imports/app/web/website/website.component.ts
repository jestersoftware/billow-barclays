import {
  Component,
  OnInit,
  NgZone
} from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { ThingService } from './../../thing.service';

import template from "./website.component.html";
import style from './website.component.scss';

@Component({
  selector: 'app-website',
  template,
  styles: [style]
})
export class WebsiteComponent implements OnInit {

  thing: any = { logo: { url: "" } };
  things: any = [];
  currentThing: any = { title: "" };

  constructor(
    private thingService: ThingService,
    private zone: NgZone,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params: Params) => {
      let getParam = {
        _id: params["id"] ? params["id"] : "Now9BcCwR7vb22Pdg"
      };
      this.thingService.getThingsByKey(getParam).subscribe(things => {
        this.zone.run(() => {
          if (things.length > 0) {
            this.thing = things[0];
            this.currentThing = { title: "" };
            this.getThings(this.thing, params["id2"]);
          }
        });
      });
    });
  }

  getThings(thing, id) {
    this.thingService.getThings(thing).subscribe(things => {
      this.zone.run(() => {
        this.things = things;

        if(id) {
          let bb = this.things.find(thing => thing._id === id);
          if(bb)
            this.currentThing = bb;
        }
        else if (this.things.length > 0)
          this.currentThing = this.things[0];
      });
    });
  }

  getKey(index: number, item: any): number {
    return item._id;
  }

  getLink(thing) {
    return "/" + this.thing._id + "/" + thing._id;
  }
}

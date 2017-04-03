import {
  Component,
  OnInit,
  AfterViewInit,
  NgZone
} from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { InjectUser } from "angular2-meteor-accounts-ui";

import { AdminService } from './../../admin.service';

import { ThingService } from './../../thing.service';

import { ScrollSpyModule, ScrollSpyService } from 'ng2-scrollspy';

import template from "./website.component.html";
import style from './website.component.scss';

@Component({
  selector: 'app-website',
  template,
  styles: [style],
  providers: [ThingService]
})
@InjectUser('user')
export class WebsiteComponent implements OnInit, AfterViewInit {

  thing: any = { logo: { url: "" } };
  things: any = [];
  currentThing: any = { title: "" };
  font: any = "Roboto";
  transparent = true;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private thingService: ThingService,
    private zone: NgZone,
    private activatedRoute: ActivatedRoute,
    private scrollSpyService: ScrollSpyService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      let thing = {
        _id: params["id"]
      };
      this.thingService.getThing(thing).subscribe(things => {
        this.zone.run(() => {
          if (things.length > 0) {
            this.thing = things[0];
            this.currentThing = { title: "" };
            this.setFont();
            this.getChildren(this.thing, params["id2"]);
          }
        });
      });
    });
  }

  ngAfterViewInit() {
    this.scrollSpyService.getObservable('scroller').subscribe((e: any) => {
      this.transparent = !(e.target.scrollTop > 400);
    });
  }

  routeChanged() {
    // Facebook due to single page application
    // https://developers.facebook.com/docs/plugins/page-plugin
    // https://developers.facebook.com/docs/reference/javascript/FB.XFBML.parse
    setTimeout(() => {
      try {
        window["FB"]["XFBML"]["parse"]();
      }
      catch (e) { }
    }, 3000);
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    Meteor.logout();
    this.router.navigate(['/login']);
  }

  getChildren(parent, id) {
    this.adminService.getChildren(parent).subscribe(things => {
      this.zone.run(() => {
        this.things = things;

        if (id) {
          let subthing = this.things.find(thing => thing._id === id);
          if (subthing) {
            this.currentThing = subthing;
          }
        }
        else if (this.things.length > 0) {
          this.currentThing = this.things[0];
          this.router.navigate([this.getLink(this.currentThing)]);
        }
      });
    });
  }

  getKey(index: number, item: any): number {
    return item._id;
  }

  getLink(thing) {
    return "/" + this.thing._id + "/" + thing._id;
  }

  setFont() {
    var links = document.getElementsByTagName("link");
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.getAttribute("rel").indexOf("style") != -1 && link.getAttribute("title") == "font") {
        if (this.thing.font && this.thing.font.url && this.thing.font.name) {
          link.disabled = false;
          link.href = this.thing.font.url;
          this.font = this.thing.font.name;
        }
        else {
          link.disabled = true;
        }
        break;
      }
    }
  }
}

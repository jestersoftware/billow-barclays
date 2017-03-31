import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  ViewChild,
  ElementRef,
  EventEmitter,
  NgZone
} from '@angular/core';

import { SchemaService } from './../../schema.service';

import { UserService } from './../../user.service';

import { ViewService } from './../../view.service';

import { ThingService } from './../../thing.service';

import { ThingImageService } from './../../thing.image.service';

import { FileUploader } from 'ng2-file-upload';

import template from "./admin-thing.component.html";
import style from './admin-thing.component.scss';

@Component({
  selector: 'app-admin-thing',
  template,
  styles: [style],
  providers: [ThingService]
})
export class AdminThingComponent implements OnInit, OnChanges {

  @Input() parent: any;
  @Input() choosing: any;
  @Output() onResize = new EventEmitter();

  things: any = [];

  eventElement: any = null;
  eventThing: any = null;

  // private uploading: boolean = false;

  private timeout: boolean = false;

  private uploader: FileUploader = new FileUploader({});

  constructor(
    public elementRef: ElementRef,
    private userService: UserService,
    private viewService: ViewService,
    private schemaService: SchemaService,
    private thingService: ThingService,
    private thingImageService: ThingImageService,
    private zone: NgZone) {
  }

  ngOnInit() {
    if (!this.parent._id) {
      // Run once to update view of User thing
      this.viewService.viewsChanged$.take(1).subscribe(views => {
        // Do NOT use zone.run() here
        this.schemaService.fixup(this.things, true);
      });

      this.userService.getCurrentUser().subscribe(users => {
        this.zone.run(() => {
          this.things = users;
          this.parent.childrenLength = this.things.length;
        });

        // Needed when top-level user object is only one shown
        if (!this.timeout) {
          this.timeout = true;
          setTimeout(() => {
            this.onResize.emit({ event: null, thing: this.parent, eventType: "load", lastThing: this.parent });
            this.timeout = false;
          }, 0);
        }
      });
    }
    else {
      this.thingService.getChildren(this.parent).subscribe(things => {
        // let isCountChanged = !this.things || this.things.length !== things.length;

        this.zone.run(() => {
          this.things = things;
          this.parent.childrenLength = this.things.length;
          this.processChoosing();         
        });

        if (/*isCountChanged && */!this.timeout) {
          this.timeout = true;
          setTimeout(() => {
            // console.log("ngInit setTimeout ************************", this.parent);
            this.doResize({ event: this.eventElement, thing: this.eventThing || this.parent, eventType: "load", lastThing: this.eventThing || this.parent });
            // this.eventElement = null;
            this.timeout = false;
          }, 0);
        }
      });
    }
  }

  ngOnChanges(simpleChanges) {
    this.processChoosing();
  }

  processChoosing() {
    if(this.choosing) {
      this.things.forEach(thing => {
        if(!this.thingService.ancestorOf(thing, this.choosing.thing)) {
          thing.session.showChoose = true;
        }
      });
    }
    else {
      this.things.forEach(thing => {
        thing.session.showChoose = false;
      });
    }    
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
    let eventTarget = event.event.target;

    // TODO: Did they click on "div" or some other input?
    if (eventTarget.localName !== "button"
      && eventTarget.localName !== "input"
      && eventTarget.localName !== "textarea") {

      event.event.stopPropagation();

      this.eventElement = this.getParentThingElement(event);;
      this.eventThing = event.thing;

      this.doResize({ event: this.eventElement, thing: event.thing, eventType: "focus", lastThing: event.thing });
    }
  }

  toggleContent(event) {
    event.event.stopPropagation();

    if (!event.thing.view)
      event.thing.view = {};

    event.thing.view.showContent = !event.thing.view.showContent;

    this.viewService.updateView(event.thing);

    this.eventElement = this.getParentThingElement(event);
    this.eventThing = event.thing;
  }

  toggleChildren(event) {
    // event.event.stopPropagation();

    if (!event.thing.view)
      event.thing.view = {};

    event.thing.view.showChildren = event.force ? true : !event.thing.view.showChildren;

    this.viewService.updateView(event.thing);

    this.eventElement = this.getParentThingElement(event);
    this.eventThing = event.thing;

    if (!event.thing.view.showChildren) {
      setTimeout(() => {
        this.doResize({ event: this.eventElement, thing: this.eventThing, eventType: "toggleChildren", lastThing: this.eventThing });
        // this.eventElement = null;
      }, 0);
    }
  }

  toggleFormat(event) {
    // event.event.stopPropagation();

    let thing = event.thing;

    if (!thing.view)
      thing.view = {};

    thing.view.format = !thing.view.format;

    thing.view.showChildren = true;

    this.viewService.updateView(event.thing);

    this.eventElement = this.getParentThingElement(event);
    this.eventThing = event.thing;
  }

  getParentThingElement(event) {
    let el = event.event.target;
    while (el.parentElement && (el = el.parentElement) && !el.classList.contains('thing'));
    return el;
  }

  getKey(index: number, item: any): number {
    return item._id;
  }

  typeChange(thing) {
    this.schemaService.fixup([thing], false);
  }

  typeClick(event) {
    event.stopPropagation();
  }

  lookupThing(event) {
    event.event.stopPropagation();
    this.doResize({ event: this.getParentThingElement(event), thing: event.thing, eventType: "lookupThing", lastThing: event.thing });
  }

  chooseThing(event) {
    event.event.stopPropagation();
    this.doResize({ event: this.choosing.event, thing: event.thing, eventType: "chooseThing", lastThing: event.thing });
  }

  openFileDialog(event, inputFile) {
    inputFile.dispatchEvent(new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    }));
  }

  onFile($event, thing, prop) {
    this.thingImageService.onFile($event, thing, prop, this.uploader);
  }

  edit(event) {
    event.event.stopPropagation();

    event.thing.session.disabled = !event.value;
  }

  create(event) {
    // event.event.stopPropagation();

    var param: any = {
      parent: event.thing._id,
      title: "(enter title)", //event.target.value
      type: event.type,
      session: { disabled: false }
    }

    this.thingService.insert(param);

    this.toggleChildren({ event: event.event, thing: event.thing, force: true });
  }

  save(event) {
    event.event.stopPropagation();

    let thing = event.thing;

    this.thingService.update(thing).subscribe({
      next: () => {
        thing.session.error = {};
      },
      error: (e: Error) => {
        this.zone.run(() => {
          thing.session.error = e;
        });
      }
    });

    this.eventElement = this.getParentThingElement(event);
    this.eventThing = thing;

    // Upload images
    this.thingImageService.upload(this.uploader, thing);
  }

  doResize(event) {
    // console.log("do resize from " + event.thing.title);

    if (!event.event && this.eventElement) {
      event.event = this.eventElement;
    }

    if (event.event && (event.eventType === "toggleChildren" || event.eventType === "load") && !this.choosing) {
      this.things.forEach(thing => {
        if (thing._id !== event.lastThing._id && thing.view && thing.view.showChildren) {
          thing.view.showChildren = false;
          thing.view.showContent = false;

          this.viewService.updateView(thing);
        }
      });
    }

    // let childrenElements = this.elementRef.nativeElement.children;

    // // If only one child, don't need to do anything
    // if (childrenElements.length > 1) {
    //   // Create an array to make other operations easier
    //   // TODO: better way?
    //   let thingsArray = [];
    //   let index = 0;
    //   for (index = 0; index < childrenElements.length; index++) {
    //     thingsArray.push(childrenElements[index]);
    //   }

    //   let currentWidths: number[] = thingsArray.map<number>(thing => { return thing.clientWidth });

    //   thingsArray.forEach(thing => { thing.style.minWidth = "auto"; }); // set DOM

    //   let naturalWidths: number[] = thingsArray.map<number>(thing => { return thing.clientWidth });
    //   let firstNaturalWidth = naturalWidths[0];

    //   // If widths are not all the same, we'll resize to the maximum width
    //   if (!naturalWidths.every(val1 => val1 === firstNaturalWidth)) {

    //     let max = Math.max.apply(null, naturalWidths);

    //     // Formula for "relative spacing""
    //     // thingsArray.forEach(thing => { thing.style.width = max + "px" /*this.maxWidth*/; });
    //     thingsArray.forEach(thing => { thing.style.minWidth = ((thing.clientWidth / max) * (max - thing.clientWidth) + thing.clientWidth) + "px"; });
    //   }
    // }

    event.lastThing = this.parent;

    this.onResize.emit(event);
  }

  open(thing) {
    window.open('/' + thing._id);
  }
}

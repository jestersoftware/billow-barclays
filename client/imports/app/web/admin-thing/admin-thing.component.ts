import { Component, OnInit, OnChanges, Input, Output, ElementRef, EventEmitter, NgZone } from '@angular/core';

import { SchemaService } from './../../schema.service';

import { UserService } from './../../user.service';

import { ViewService } from './../../view.service';

import { ThingService } from './../../thing.service';

import { AdminService } from './../../admin.service';

import { ThingImageService } from './../../thing.image.service';

import { UploadService } from './../../upload.service';

import { FileUploader } from 'ng2-file-upload';

import template from "./admin-thing.component.html";
import style from './admin-thing.component.scss';

@Component({
  selector: 'app-admin-thing',
  template,
  styles: [style]
})
export class AdminThingComponent implements OnInit, OnChanges {

  @Input() parent: any;
  @Input() choosing: any;
  @Output() onResize = new EventEmitter();
  @Output() onCount = new EventEmitter();

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
    private adminService: AdminService,
    private thingService: ThingService,
    private thingImageService: ThingImageService,
    private uploadService: UploadService,
    private zone: NgZone) {
  }

  ngOnInit() {

  }

  ngOnChanges(simpleChanges) {
    if (simpleChanges["parent"])
      this.loadData();

    if (simpleChanges["choosing"])
      this.processChoosing();
  }

  loadData() {

    if (!this.parent._id) {
      // Run once to update view of User thing
      this.viewService.viewsChanged$.take(1).subscribe(views => {
        // Do NOT use zone.run() here
        this.schemaService.fixup(this.things, true);
      });

      this.userService.getCurrentUser().subscribe(users => {
        this.things = users;
        this.onCount.emit({ thing: this.parent, count: this.things.length });

        // Needed when top-level user object is only one shown
        if (!this.timeout) {
          this.timeout = true;
          setTimeout(() => {
            this.onResize.emit(
              {
                event: null,
                thing: this.parent,
                eventType: "load",
                lastThing: this.parent
              });
            this.timeout = false;
          }, 0);
        }
      });
    }
    else {
      this.adminService.getChildren(this.parent).subscribe(things => {
        let isCountChanged = !this.things || this.things.length !== things.length;

        this.things = things;
        this.onCount.emit({ thing: this.parent, count: this.things.length });
        this.processChoosing();

        if (isCountChanged && !this.timeout) {
          this.timeout = true;
          setTimeout(() => {
            // console.log("ngInit setTimeout ************************", this.parent);
            this.doResize(
              {
                event: this.eventElement,
                thing: this.eventThing || this.parent,
                eventType: "load",
                lastThing: this.eventThing || this.parent
              });
            // this.eventElement = null;
            this.timeout = false;
          }, 0);
        }
      });
    }
  }

  doCount(event) {
    this.things.forEach(thing => {
      if (thing._id === event.thing._id) {
        setTimeout(() => {
          thing.session.childrenLength = event.count;
        }, 100);
      }
    });
  }

  processChoosing() {
    if (this.choosing) {
      this.things.forEach(thing => {
        if (this.choosing.test.call(this, { thing: thing, choosing: this.choosing })) {
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

  getArchetype(thing) {
    return this.schemaService.getArchetype(thing);
  }

  getArchetypes(thing) {
    return this.schemaService.getArchetypes(thing);
  }

  getProperties(thing) {
    return this.schemaService.getProperties(thing);
  }

  disabled(event) {
    return !event.thing.session || event.thing.session.disabled || this.choosing;
  }

  click(event) {
    let eventTarget = event.event.target;

    // TODO: Did they click on "div" or some other input?
    if ((eventTarget.localName !== "button" || eventTarget.disabled)
      && (eventTarget.localName !== "input" || eventTarget.disabled)
      && (eventTarget.localName !== "textarea" || eventTarget.disabled)) {

      event.event.stopPropagation();

      this.eventElement = this.thingService.getParentThingElement(event);
      this.eventThing = event.thing;

      this.doResize({ event: this.eventElement, thing: event.thing, eventType: "focus", lastThing: event.thing });
    }
  }

  toggleContent(event) {
    event.event.stopPropagation();

    if (!event.thing.view)
      event.thing.view = {};

    event.thing.view.showContent = !event.thing.view.showContent;

    this.viewService.update(event.thing);

    this.eventElement = this.thingService.getParentThingElement(event);
    this.eventThing = event.thing;
  }

  toggleChildren(event) {
    event.event.stopPropagation();

    if (!event.thing.view)
      event.thing.view = {};

    event.thing.view.showChildren = event.force ? true : !event.thing.view.showChildren;

    this.viewService.update(event.thing);

    this.eventElement = this.thingService.getParentThingElement(event);
    this.eventThing = event.thing;

    setTimeout(() => {
      this.doResize(
        {
          event: this.eventElement,
          thing: this.eventThing,
          eventType: "toggleChildren",
          lastThing: this.eventThing
        });
    }, 0);
  }

  toggleFormat(event) {
    event.event.stopPropagation();

    if (!event.thing.view)
      event.thing.view = {};

    event.thing.view.format = !event.thing.view.format;

    event.thing.view.showChildren = true;

    this.viewService.update(event.thing);

    this.eventElement = this.thingService.getParentThingElement(event);
    this.eventThing = event.thing;
  }

  getId(index: number, item: any): number {
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

    this.doResize(
      {
        event: this.thingService.getParentThingElement(event),
        thing: event.thing,
        eventType: "lookupThing",
        lastThing: event.thing,
        action: event.action,
        test: event.test
      });
  }

  chooseThing(event) {
    event.event.stopPropagation();

    this.choosing.action.call(this, event);

    this.eventThing = event.thing;

    this.doResize(
      {
        event: this.eventElement,
        thing: this.eventThing,
        eventType: "chooseThing",
        lastThing: this.eventThing
      });
  }

  openFileDialog(event, inputFile) {
    inputFile.dispatchEvent(new MouseEvent('click', {
      'view': window,
      'bubbles': false,
      'cancelable': true
    }));
  }

  onFile($event, thing, prop) {
    this.uploadService.onFile($event, thing, prop, this.uploader);
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

    this.eventElement = this.thingService.getParentThingElement(event);
    this.eventThing = thing;

    // Upload images
    this.uploadService.upload(this.uploader, thing);
  }

  delete(event) {
    event.event.stopPropagation();

    this.adminService.delete(event.thing);
  }

  referto(event) {
    this.eventElement = this.choosing.event;

    this.choosing.thing.reference._id = event.thing._id;
    this.choosing.thing.title = event.thing.title;
    // this.choosing.thing.description = "Reference to " + event.thing.title; // TODO?
  }

  refertoTest(event) {
    return !this.thingService.ancestorOf(event.choosing.thing, event.thing) && !this.thingService.ancestorOf(event.thing, event.choosing.thing);
  }

  reparent(event) {
    this.eventElement = this.thingService.getParentThingElement(event);

    event.thing.view.showChildren = true;

    this.viewService.update(event.thing);

    this.thingService.update(
      {
        _id: this.choosing.thing._id,
        parent: event.thing._id
      });
  }

  reparentTest(event) {
    return !this.thingService.ancestorOf(event.choosing.thing, event.thing) && !this.thingService.parentOf(event.thing, event.choosing.thing);
  }

  doResize(event) {
    // console.log("do resize from " + event.thing.title);

    if (!event.event && this.eventElement) {
      event.event = this.eventElement;
    }

    if (event.event && event.thing && event.thing.view && event.thing.view.showChildren && (event.eventType === "toggleChildren" || event.eventType === "load") && !this.choosing) {
      this.things.forEach(thing => {
        if (thing._id !== event.lastThing._id
          && thing.view
          && thing.view.showChildren) {
          thing.view.showChildren = false;
          thing.view.showContent = false;

          this.viewService.update(thing);
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

  open(event) {
    event.event.stopPropagation();

    window.open('/' + event.thing._id);
  }
}

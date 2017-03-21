import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ElementRef,
  EventEmitter,
  NgZone
} from '@angular/core';

import { SchemaService } from './../../schema.service';

import { UserService } from './../../user.service';

import { ThingService } from './../../thing.service';

import { ThingImageService } from './../../thing.image.service';

import { AdminActionComponent } from './../admin-action/admin-action.component';

import { FileUploader } from 'ng2-file-upload';

import template from "./admin-thing.component.html";
import style from './admin-thing.component.scss';

@Component({
  selector: 'app-admin-thing',
  template,
  styles: [style]
})
export class AdminThingComponent implements OnInit {

  @Input() auth: any;
  @Input() parent: any;
  @Output() onResize = new EventEmitter();

  things: any = [];

  eventElement: any = null;

  uploading: boolean = false;

  timeout: boolean = false;

  public uploader: FileUploader = new FileUploader({});

  constructor(
    public elementRef: ElementRef,
    private userService: UserService,
    private schemaService: SchemaService,
    private thingService: ThingService,
    private thingImageService: ThingImageService,
    private zone: NgZone) {
  }

  ngOnInit() {
    if (this.auth) {
      if (!this.parent._id) {
        let getParam = {
          _id: this.auth._id
        };
        this.userService.getUserByKey(getParam).subscribe(users => {
          this.zone.run(() => {
            this.things = users;
            this.parent.childrenLength = this.things.length;

            if(!this.timeout) {
              this.timeout = true;
              setTimeout(() => { 
                this.onResize.emit({ event: null, thing: this.parent }); 
                this.timeout = false;
              }, 0);
            }
          });
        });
      }
      else {
        this.thingService.getThings(this.parent).subscribe(things => {
          this.zone.run(() => {
            this.things = things;
            this.parent.childrenLength = this.things.length;

            if(!this.timeout) {
              this.timeout = true;
              setTimeout(() => {
                this.doResize({ event: this.eventElement, thing: this.parent });
                // this.eventElement = null;
                this.timeout = false;
              }, 0);
            }
          });
        });
      }
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

    event.event.stopPropagation();

    let el = event.event.target;
    while (el.parentElement && (el = el.parentElement) && !el.classList.contains('thing'));

    this.eventElement = el;

    setTimeout(() => {
      this.doResize({ event: this.eventElement, thing: event.thing });
      // this.eventElement = null;
    }, 0);

  }

  toggleContent(event) {

    event.event.stopPropagation();

    let thing = event.thing;

    if (!thing.view)
      thing.view = {};

    thing.view.showContent = !thing.view.showContent;

    var param: any = {
      _id: thing._id,
      view: thing.view
    }

    this.thingService.update(param, null);

    let el = event.event.target;

    if (!el.parentElement)
      console.log ("??????????????");

    while (el.parentElement && (el = el.parentElement) && !el.classList.contains('thing')) {
      console.log (el.parentElement);
    }
      

    this.eventElement = el;

    // console.log(typeof this.eventElement);
  }

  toggleChildren(event) {

    event.event.stopPropagation();
    
    let thing = event.thing;

    if (!thing.view)
      thing.view = {};

    thing.view.showChildren = event.force ? true : !thing.view.showChildren;

    var param: any = {
      _id: thing._id,
      view: thing.view
    }

    this.thingService.update(param, null);

    let el = event.event.target;
    while (el.parentElement && (el = el.parentElement) && !el.classList.contains('thing'));

    this.eventElement = el;

    if (!thing.view.showChildren) {
      setTimeout(() => {
        this.doResize({ event: this.eventElement, thing: thing });
        // this.eventElement = null;
      }, 0);
    }
  }

  toggleFormat(event) {

    event.event.stopPropagation();

    let thing = event.thing;

    if (!thing.view)
      thing.view = {};

    thing.view.format = !thing.view.format;

    thing.view.showChildren = true;

    var param: any = {
      _id: thing._id,
      view: thing.view
    }

    this.thingService.update(param, null);

    let el = event.event.target;
    while (el.parentElement && (el = el.parentElement) && !el.classList.contains('thing'));

    this.eventElement = el;
  }

  getKey(index: number, item: any): number {
    return item._id;
  }

  typeChanged(thing) {
    this.schemaService.fixup([thing]);
  }

  openFileDialog($event, inputFile) {
    console.log($event);

    inputFile.dispatchEvent(new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    }));
  }

  onFile($event, thing, prop) {

    if($event.target.files.length > 0) {

      // Get last added item
      let item = this.uploader.queue[this.uploader.queue.length - 1];

      // Set custom alias for tracking purposes
      // TODO: could break, use separate array instead??
      let alias = thing._id + ":" + prop.key;

      // See if same item already queued
      // let existing = this.files.find(file => file.prop === key);
      let existing = this.uploader.queue.find(q => q.alias === alias);

      // If so, remove it
      if(existing) {
        this.uploader.removeFromQueue(existing);
        // existing.item = item;
      }
      // else {
        // existing = { prop: prop.key, item: item }
        // this.files.push(existing);
      // }
      item.alias = alias;

      if(prop.preview)
        thing[prop.key][prop.name] = item.file.name;

    }

  }

  edit(event) {

    event.event.stopPropagation();
    
    let thing = event.thing;

    if (!thing.session)
      thing.session = {};

    thing.session.disabled = !event.value;
  }

  create(event) {
    // console.log(event);

    event.event.stopPropagation();

    let thing = event.thing;

    var param: any = {
      userId: this.auth._id,
      parent: thing._id,
      title: "(enter title)", //event.target.value
      type: event.event.target.parentElement.parentElement.innerText
    }

    if (thing.view) {
      param.view = thing.view;
    }

    this.thingService.insert(param);

    this.toggleChildren({ event: event, thing: thing, force: true });
  }

  save(event) {
    // console.log(event);

    event.event.stopPropagation();

    let thing = event.thing;

    this.thingService.update(thing, this.auth._id);

    let el = event.event.target;
    while (el.parentElement && (el = el.parentElement) && !el.classList.contains('thing'));

    this.eventElement = el;

    /*
     Upload images
    */
    let queueLength = this.uploader.queue.length;

    if (queueLength > 0) {
      this.uploading = true;

      let count = 0;

      this.uploader.queue.filter(qItem => qItem.alias.split(":")[0] === thing._id).forEach(item => {

        this.thingImageService.uploadFile(item._file).then((result) => {

          count++;

          console.log("Success uploading file", result);

          let propKey = item.alias.split(":")[1];

          if(!thing[propKey])
            thing[propKey] = {};

          // thing[alias].url = result.url;
          thing[propKey] = result; // TODO: pass all the data like this, or just some?

          let param: any = {
            _id: thing._id
          };

          param[propKey] = thing[propKey];

          this.thingService.update(param, null);

          this.thingImageService.getThumb({_id: result._id}).subscribe((thumb) => {
            param[propKey].previewPath = thumb.path;
            this.thingService.update(param, null);
          });

          if(count >= queueLength) {

            this.uploading = false;

            setTimeout(() => {
              this.uploader.clearQueue();
            }, 0);

          }

        })
        .catch((error) => {
          // this.uploading = false;

          count++;

          console.log("Error uploading file", error);

          if(count >= queueLength) {

            this.uploading = false;

            setTimeout(() => {
              this.uploader.clearQueue();
            }, 0);

          }

        });
      });

    }
  }

  doResize(event) {
    let things = this.elementRef.nativeElement.children;

    // console.log("do resize from " + event.thing.title);

    // If only one child, don't need to do anything
    if (things.length > 1) {
      // Create an array to make other operations easier
      // TODO: better way?
      let thingsArray = [];
      let index = 0;
      for (index = 0; index < things.length; index++) {
        thingsArray.push(things[index]);
      }

      let currentWidths: number[] = thingsArray.map<number>(thing => { return thing.clientWidth });

      thingsArray.forEach(thing => { thing.style.minWidth = "auto"; }); // set DOM

      let naturalWidths: number[] = thingsArray.map<number>(thing => { return thing.clientWidth });
      let firstNaturalWidth = naturalWidths[0];

      // If widths are not all the same, we'll resize to the maximum width
      if (!naturalWidths.every(val1 => val1 === firstNaturalWidth)) {

        let max = Math.max.apply(null, naturalWidths);

        // Formula for "relative spacing""
        // thingsArray.forEach(thing => { thing.style.width = max + "px" /*this.maxWidth*/; });
        thingsArray.forEach(thing => { thing.style.minWidth = ((thing.clientWidth / max) * (max - thing.clientWidth) + thing.clientWidth) + "px"; });
      }
    }

    if (!event.event && this.eventElement) {
      event.event = this.eventElement;
    }

    this.onResize.emit(event);
  }

  open(thing) {
    window.open('/' + thing._id);
  }
}

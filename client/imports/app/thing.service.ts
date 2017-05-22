import { Injectable } from '@angular/core';

import { Observable, Subscription, Subject } from "rxjs/Rx";

import { MeteorObservable, ObservableCursor } from "meteor-rxjs";

import { Things, Security } from "./../../../both/collections/things.collection";

import { ThingImageService } from './thing.image.service';

import { SchemaService } from './schema.service';

@Injectable()
export class ThingService {

  security: Security;
  thingsSubscription: Subscription;

  isAdding: any = false;

  constructor(
    private schemaService: SchemaService,
    private thingImageService: ThingImageService) {
    this.security = new Security();
  }

  ngOnDestroy() {
    if (this.thingsSubscription)
      this.thingsSubscription.unsubscribe();
  }

  ancestorOf(thing, compareTo) {
    if (!compareTo)
      return false;
    if (thing._id === compareTo._id)
      return true;
    else
      return this.ancestorOf(thing, compareTo.session.parentThing);
  }

  parentOf(thing, compareTo) {
    return thing._id === compareTo.parent;
  }

  getParentThingElement(event) {
    let el = event.event.target;
    while (el.parentElement && (el = el.parentElement) && !el.classList.contains('thing'));
    return el;
  }

  getThing(thing): Observable<any> {
    if (!this.thingsSubscription)
      this.thingsSubscription = MeteorObservable.subscribe('thing.all').subscribe();

    return Observable.create(observer => {
      Things.find({ _id: thing._id }).subscribe(things => {
        this.fixup(things);

        this.schemaService.fixup(things, true);

        observer.next(things);
      });
    });
  }

  getChildren(thing): Observable<any> {
    if (!this.thingsSubscription)
      this.thingsSubscription = MeteorObservable.subscribe('thing.all').subscribe();

    return Observable.create(observer => {
      let query: any = { parent: thing._id };

      if (thing.reference && thing.reference._id) {
        query = { $or: [query, { _id: thing.reference._id }] };
      }

      Things.find(query, { sort: { "order.index": 1, title: 1 } }).subscribe(things => {
        // console.log('childrenCursor subscribe', things.length, things);
        let uninitialized = [];

        things.forEach(thing => {
          if (!thing.session || !thing.session.initialized)
            uninitialized.push(thing);
        });

        if (uninitialized.length > 0) {
          this.fixup(uninitialized);

          this.schemaService.fixup(uninitialized, true, thing, this.isAdding);

          this.isAdding = false;

          this.security.setPermissions(uninitialized, thing._id);

          observer.next(things);
        }
      });
    });
  }

  fixup(things) {
    things.forEach(thing => {
      this.schemaService.getProperties(thing).forEach(property => {
        if (property.type === "image") {
          if (thing[property.key] && thing[property.key]._id) {
            this.thingImageService.getImage({ _id: thing[property.key]._id }).subscribe(image => {
              thing[property.key][property.name] = image.path + "?token=" + image.token;
            });

            this.thingImageService.getThumb({ _id: thing[property.key]._id }).subscribe(thumb => {
              thing[property.key][property.preview] = thumb.path + "?token=" + thumb.token;
            });
          }
        }
      });
    });
  }

  doIt(query, observer) {
    let things = Things.find(query, { sort: { "order.index": 1, title: 1 } }).fetch();

    this.schemaService.fixup(things, true);

    observer.next(things);
  }

  getThingsByQuery(query): Observable<any> {
    // if (!this.thingsSubscription)
    //   this.thingsSubscription = MeteorObservable.subscribe('thing.all').subscribe();

    return Observable.create(observer => {

      if (!this.thingsSubscription) {

        this.thingsSubscription = MeteorObservable.subscribe('thing.all').subscribe(() => {
          this.doIt(query, observer);
        });
      }
      else {
        this.doIt(query, observer);
      }
    });
  }

  insert(pushParam) {
    let thing = {
      parent: pushParam.parent,
      title: pushParam.title,
      type: pushParam.type
    };

    this.isAdding = true;

    MeteorObservable.call('things.insert', thing).subscribe({
      next: () => {
      },
      error: (e: Error) => {
        console.log(e);
      }
    });
  }

  update(thing) {
    let subject = new Subject();

    let copy = Object.assign({}, thing);

    let id = copy._id;

    // TODO: Don't update some properties ... do in method?
    delete copy['_id'];
    delete copy['session'];
    delete copy['view'];
    delete copy['meta'];

    MeteorObservable.call('things.update', id, copy).subscribe({
      next: () => {
      },
      error: (e: Error) => {
        // console.log(e);
        subject.error(e);
      }
    });

    return subject;
  }

  delete(thing) {
    MeteorObservable.call('things.remove', thing._id).subscribe({
      next: () => {
      },
      error: (e: Error) => {
        console.log(e);
      }
    });
  }
}

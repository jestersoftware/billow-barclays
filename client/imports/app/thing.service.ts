import { Injectable } from '@angular/core';

import { Observable, Subscription, Subject } from "rxjs/Rx";

import { MeteorObservable, ObservableCursor } from "meteor-rxjs";

import { Things, Security } from "./../../../both/collections/things.collection";

import { SchemaService } from './schema.service';

@Injectable()
export class ThingService {

  security: Security;
  thingsSubscription: Subscription;

  constructor(
    private schemaService: SchemaService) {
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
        this.schemaService.fixup(things, true);

        observer.next(things);
      });
    });
  }

  getChildren(thing): Observable<any> {
    if (!this.thingsSubscription)
      this.thingsSubscription = MeteorObservable.subscribe('thing.all').subscribe();

    return Observable.create(observer => {
      let refId;
      let query: any = { parent: thing._id };

      if (thing.reference && thing.reference._id) {
        refId = thing.reference._id;
        query = { $or: [query, { _id: refId }] };
      }

      Things.find(query, { sort: { "order.index": 1, title: 1 } }).subscribe(things => {
        // console.log('childrenCursor subscribe', things.length, things);
        let uninitialized = [];

        things.forEach(thing => {
          if (!thing.session || !thing.session.initialized)
            uninitialized.push(thing);
        });

        if (uninitialized.length > 0) {
          this.schemaService.fixup(uninitialized, true, thing);

          this.security.setPermissions(uninitialized, thing._id);

          observer.next(things);
        }
      });
    });
  }

  getThingsByQuery(query): Observable<any> {
    if (!this.thingsSubscription)
      this.thingsSubscription = MeteorObservable.subscribe('thing.all').subscribe();

    return Observable.create(observer => {
      let things = Things.find(query, { sort: { "order.index": 1, title: 1 } }).fetch();

      this.schemaService.fixup(things, true);

      observer.next(things);
    });
  }

  insert(pushParam) {
    let thing = {
      parent: pushParam.parent,
      title: pushParam.title,
      type: pushParam.type
    };

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
}

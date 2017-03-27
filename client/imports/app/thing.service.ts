import { Injectable } from '@angular/core';

import { Observable, Subscription, Subject } from "rxjs/Rx";

import { MeteorObservable, ObservableCursor } from "meteor-rxjs";

import { Things } from "./../../../both/collections/things.collection";

import { SchemaService } from './schema.service';

@Injectable()
export class ThingService {

  thingSubscription: Subscription;
  // thingCursor: ObservableCursor<any>;
  childrenSubscription: Subscription;
  childrenCursor: ObservableCursor<any[]>;

  constructor(private schemaService: SchemaService) {
  }

  getThing(thing): Observable<any> {
    let subject = new Subject();

    this.thingSubscription = MeteorObservable.subscribe('thing', thing._id).subscribe(() => {

      // this.thingCursor = Things.findOne({ _id: thing._id });
      let thing1 = Things.findOne({ _id: thing._id });
      
      // let things = this.thingCursor.fetch();

      subject.next(this.schemaService.fixup([thing1]));

      // this.thingCursor.subscribe(things => {

      //   subject.next(this.schemaService.fixup(things));

      // });
    });

    return subject;
  }

  getChildren(thing): Subject<any> {
    // console.log("getChildren called by ", thing.title);

    let subject = new Subject();

    let parentId = /*thing.type === "User" ? "Root" :*/ thing._id;
    let refId;

    let query: any = { parent: parentId };

    if(thing.reference && thing.reference._id) {
      refId = thing.reference._id;
      query = { $or: [query, { _id: refId }] }; 
    }

    this.childrenSubscription = MeteorObservable.subscribe('thing.children', parentId, refId).subscribe(() => {
      // console.log("childrenSubscription returned ", thing.title);

      this.childrenCursor = Things.find(query, { sort: { "order.index": 1, title: 1 } });
      
      let things = this.childrenCursor.fetch();

      subject.next(this.schemaService.fixup(things));

      this.childrenCursor.subscribe(things => {
        // console.log("childrenCursor returned ", thing.title, things);

        subject.next(this.schemaService.fixup(things));
      }/*, err => {
        console.log(err);
      }, () => {
        console.log("things subscription complete", thing.title);
      }*/);

    });

    return subject;
  }

  getThingsByQuery(query): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('things').subscribe(() => {

      // let thingsSub = Things.find(query, { sort: { "order.index": 1, title: 1 } });
      let things = Things.find(query, { sort: { "order.index": 1, title: 1 } }).fetch();

      // thingsSub.subscribe(things => {

        subject.next(this.schemaService.fixup(things));

      // });

    });

    return subject;
  }

  insert(pushParam) {
    let thing = {
      meta: {
        creator: pushParam.userId,
        modifier: pushParam.userId
      },
      parent: pushParam.parent,
      title: pushParam.title,
      type: pushParam.type,
      view: pushParam.view
    };

    MeteorObservable.call('things.insert', thing).subscribe({
      next: () => {
        // console.log('insert success ' + thing.title);
      },
      error: (e: Error) => {
        console.log(e);
      }
    });
  }

  update(thing, userId) {

    if (userId) {
      if (!thing.meta)
        thing.meta = {}
      thing.meta.modifier = userId;
    }

    let copy = Object.assign({}, thing);

    let id = copy._id;

    delete copy['_id'];
    delete copy['session'];

    MeteorObservable.call('things.update', id, copy).subscribe({
      next: () => {
        // console.log('update success ' + id);
      },
      error: (e: Error) => {
        console.log(e);
      }
    });
  }
}

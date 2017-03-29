import { Injectable } from '@angular/core';

import { Observable, Subscription, Subject } from "rxjs/Rx";

import { MeteorObservable, ObservableCursor } from "meteor-rxjs";

import { Things, Security } from "./../../../both/collections/things.collection";

import { SchemaService } from './schema.service';

@Injectable()
export class ThingService {

  thingSubscription: Subscription;

  childrenSubscription: Subscription;
  childrenCursor: ObservableCursor<any>;

  security = new Security();

  constructor(private schemaService: SchemaService) {
  }

  getThing(thing): Observable<any> {
    let subject = new Subject();

    this.thingSubscription = MeteorObservable.subscribe('thing', thing._id).subscribe(() => {

      let thing1 = Things.findOne({ _id: thing._id });
      
      subject.next(this.schemaService.fixup([thing1], true));
    });

    return subject;
  }

  getChildren(thing): Subject<any> {
    let subject = new Subject();

    let parentId = thing._id;
    let refId;

    let query: any = { parent: parentId };

    if(thing.reference && thing.reference._id) {
      refId = thing.reference._id;
      query = { $or: [query, { _id: refId }] }; 
    }

    this.childrenSubscription = MeteorObservable.subscribe('thing.children', parentId, refId).subscribe(() => {
      this.childrenCursor = Things.find(query, { sort: { "order.index": 1, title: 1 } });
      
      let things = this.childrenCursor.fetch();

      let editable = this.security.checkRole(parentId, "update", Meteor.userId());
      things.forEach(thing1 => {
        if(!thing1.session)
          thing1.session = {};

        if(!editable)
          editable = this.security.checkRole(thing1._id, "update", Meteor.userId());

        thing1.session.editable = editable;
      });

      subject.next(this.schemaService.fixup(things, true));

      this.childrenCursor.subscribe(things => {
        subject.next(this.schemaService.fixup(things, true));
      });
    });

    return subject;
  }

  getThingsByQuery(query): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('things').subscribe(() => {

      // let thingsSub = Things.find(query, { sort: { "order.index": 1, title: 1 } });
      let things = Things.find(query, { sort: { "order.index": 1, title: 1 } }).fetch();

      // thingsSub.subscribe(things => {

        subject.next(this.schemaService.fixup(things, true));

      // });

    });

    return subject;
  }

  insert(pushParam) {
    let thing = {
      parent: pushParam.parent,
      title: pushParam.title,
      type: pushParam.type /*,
      view: pushParam.view*/
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

  update(thing) {
    let subject = new Subject();

    let copy = Object.assign({}, thing);

    let id = copy._id;

    // Don't update _id or session or view properties
    delete copy['_id'];
    delete copy['session'];
    delete copy['view'];

    MeteorObservable.call('things.update', id, copy).subscribe({
      next: () => {
        // subject.next("Success");
      },
      error: (e: Error) => {
        // console.log(e);
        subject.error(e);
      }
    });

    return subject;
  }
}

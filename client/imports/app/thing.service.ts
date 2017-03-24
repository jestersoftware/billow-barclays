import { Injectable } from '@angular/core';

import { Observable, Subject } from "rxjs/Rx";

import { MeteorObservable } from "meteor-rxjs";

import { Things } from "./../../../both/collections/things.collection";

import { SchemaService } from './schema.service';

@Injectable()
export class ThingService {

  constructor(private schemaService: SchemaService) {
  }

  getThingsByKey(getParam): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('thing').subscribe(() => {

      let thingsSub = Things.find({ _id: getParam._id });

      thingsSub.subscribe(things => {

        subject.next(this.schemaService.fixup(things));

      });
    });

    return subject;
  }

  getThings(thing): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('things').subscribe(() => {

      let query: any = { parent: thing._id };

      if(thing.reference && thing.reference._id)
        query = { $or: [query, { _id: thing.reference._id }] }; 

      let thingsSub = Things.find(query, { sort: { "order.index": 1, title: 1 } });

      thingsSub.subscribe(things => {

        subject.next(this.schemaService.fixup(things));

      });

    });

    return subject;
  }

  getThingsByQuery(query): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('things').subscribe(() => {

      let thingsSub = Things.find(query, { sort: { "order.index": 1, title: 1 } });

      thingsSub.subscribe(things => {

        subject.next(this.schemaService.fixup(things));

      });

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

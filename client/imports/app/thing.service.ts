import { Injectable } from '@angular/core';

import { Observable, Subscription, Subject } from "rxjs/Rx";

import { MeteorObservable, ObservableCursor } from "meteor-rxjs";

import { Things, Security } from "./../../../both/collections/things.collection";

import { SchemaService } from './schema.service';

import { UserService } from './user.service';
import { RoleService } from './role.service';

@Injectable()
export class ThingService {

  thingSubscription: Subscription;

  childrenSubscription: Subscription;
  childrenCursor: ObservableCursor<any>;

  security = new Security();

  constructor(
    private schemaService: SchemaService,
    private userService: UserService,
    private roleService: RoleService) {
  }

  setPermissions(parentId, things) {
    let editable = this.security.checkRole(parentId, ["update"], Meteor.userId());

    things.forEach(thing1 => {
      if (!thing1.session) {
        thing1.session = { disabled: true }; // TODO: fix up somewhere else
      }

      // If we can't edit the parent, can we edit the thing itself?
      if (!editable) {
        editable = this.security.checkRole(thing1._id, ["update"], Meteor.userId());
      }

      thing1.session.editable = editable;
    });
  }

  ancestorOf(thing, compareTo) {
    if(!compareTo)
      return false;
    if(thing._id === compareTo._id)
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

    if (thing.reference && thing.reference._id) {
      // TODO
      if(thing.reference._id === "users")
      {
        return this.userService.getUsers();
      }
      if(thing.reference._id === "roles")
      {
        return this.roleService.getRoles();
      }
      refId = thing.reference._id;
      query = { $or: [query, { _id: refId }] };
    }

    this.childrenSubscription = MeteorObservable.subscribe('thing.children', parentId, refId).subscribe(() => {
      this.childrenCursor = Things.find(query, { sort: { "order.index": 1, title: 1 } });

      // let things = this.childrenCursor.fetch();

      // this.setPermissions(parentId, things)

      // subject.next(this.schemaService.fixup(things, true));

      this.childrenCursor.subscribe(things => {
        this.setPermissions(parentId, things);
        subject.next(this.schemaService.fixup(things, true, thing));
      });
    });

    return subject;
  }

  getThingsByQuery(query): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('thing.query', query).subscribe(() => {

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
      type: pushParam.type
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

    // TODO: Don't update some properties ... do in method?
    delete copy['_id'];
    delete copy['session'];
    delete copy['view'];
    delete copy['meta'];

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

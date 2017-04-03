import { Injectable } from '@angular/core';

import { Subject } from "rxjs/Rx";

import { MeteorObservable } from "meteor-rxjs";

import { SchemaService } from './schema.service';

import { DisplayNamePipe } from './pipe/display-name.pipe';

@Injectable()
export class UserService {

  constructor(private schemaService: SchemaService, private displayNamePipe: DisplayNamePipe) {
  }

  getCurrentUser(): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('users').subscribe(() => {
      let user = Meteor.users.findOne({ _id: Meteor.userId() });

      let userArray = [];

      userArray.push(
        {
          _id: "Root",
          parent: "",
          title: this.displayNamePipe.transform(user),
          type: "User" /*,
          view: { showChildren: true }*/
        });

      this.schemaService.fixup(userArray, true);

      subject.next(userArray);
    });

    return subject;
  }


  getUsers(thing): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('users').subscribe(() => {
      let users = Meteor.users.find().fetch();

      let userArray = [];

      users.forEach(user => {
        userArray.push(
          {
            _id: user._id,
            parent: "users",
            title: this.displayNamePipe.transform(user),
            type: "User"
          });
      });

      this.schemaService.fixup(userArray, true);

      subject.next(userArray);
    });

    return subject;
  }
  
}
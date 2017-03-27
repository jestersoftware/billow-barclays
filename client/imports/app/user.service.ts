import { Injectable } from '@angular/core';

import { Observable, Subject } from "rxjs/Rx";

import { MeteorObservable } from "meteor-rxjs";

import { SchemaService } from './schema.service';

// import { Users } from './../../../both/collections/users.collection';

// import { User } from './../../../both/models/user.model';

import { DisplayNamePipe } from './pipe/display-name.pipe';

@Injectable()
export class UserService {

  constructor(private schemaService: SchemaService, private displayNamePipe: DisplayNamePipe) {
  }

  getUser(getParam): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('users'/*, getParam._id*/).subscribe(() => {

      // let usersSub = Users.find({ _id: getParam._id });
      let user = Meteor.users.findOne({ _id: getParam._id });

      // usersSub.subscribe(users => {

        let userArray = [];

        // users.forEach(user => {
          userArray.push(
            {
              _id: "Root", //user._id, 
              title: this.displayNamePipe.transform(user),
              type: "User",
              view: { showChildren: true }
            });
        // });

        subject.next(this.schemaService.fixup(userArray));

      // });
    });

    // let user = Meteor.user() || { username: "Unknown User" };

    // let userArray = [];

    // userArray.push(
    //   {
    //     _id: "Root",
    //     title: this.displayNamePipe.transform(user),
    //     type: "User",
    //     view: { showChildren: true }
    //   });

    // subject.next(this.schemaService.fixup(userArray));

    return subject;
  }
}
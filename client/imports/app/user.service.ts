import { Injectable } from '@angular/core';

import { Observable, Subject } from "rxjs/Rx";

import { MeteorObservable } from "meteor-rxjs";

import { SchemaService } from './schema.service';

import { Users } from './../../../both/collections/users.collection';

// import { User } from './../../../both/models/user.model';

import { DisplayNamePipe } from './pipe/display-name.pipe';

@Injectable()
export class UserService {

  constructor(private schemaService: SchemaService, private displayNamePipe: DisplayNamePipe) {
  }

  getUserByKey(getParam): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('users', getParam._id).subscribe(() => {

      let usersSub = Users.find({ _id: getParam._id });

      usersSub.subscribe(users => {

        let userArray = [];

        users.forEach(user => {
          userArray.push(
            {
              _id: user._id, 
              title: this.displayNamePipe.transform(user),
              type: "User",
              view: { showChildren: true }
            });
        });

        subject.next(this.schemaService.fixup(userArray));

      });
    });

    return subject;
  }
}
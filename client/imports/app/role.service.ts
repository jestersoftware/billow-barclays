import { Injectable } from '@angular/core';

import { Subject } from "rxjs/Rx";

import { MeteorObservable } from "meteor-rxjs";

import { SchemaService } from './schema.service';

import { DisplayNamePipe } from './pipe/display-name.pipe';

// import { Roles } from "./../../../both/collections/roles.collection";
import { Roles } from "meteor/alanning:roles";

@Injectable()
export class RoleService {

  constructor(private schemaService: SchemaService, private displayNamePipe: DisplayNamePipe) {
  }

  // getCurrentUser(): Subject<any> {
  //   let subject = new Subject();

  //   MeteorObservable.subscribe('users').subscribe(() => {
  //     let user = Meteor.users.findOne({ _id: Meteor.userId() });

  //     let userArray = [];

  //     userArray.push(
  //       {
  //         _id: "Root",
  //         parent: "",
  //         title: this.displayNamePipe.transform(user),
  //         type: "User" /*,
  //         view: { showChildren: true }*/
  //       });

  //     subject.next(this.schemaService.fixup(userArray, true));
  //   });

  //   return subject;
  // }


  getRoles(): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('roles').subscribe(() => {
      let roles: any = Roles.getAllRoles().fetch();

      let roleArray = [];

      roles.forEach(role => {
        roleArray.push(
          {
            _id: role._id,
            parent: "",
            title: role.name,
            type: "Role"
          });
      });

      subject.next(this.schemaService.fixup(roleArray, true));
    });

    return subject;
  }
  
}
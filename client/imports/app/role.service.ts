import { Injectable } from '@angular/core';

import { Subject } from "rxjs/Rx";

import { MeteorObservable } from "meteor-rxjs";

import { SchemaService } from './schema.service';

import { DisplayNamePipe } from './pipe/display-name.pipe';

import { Roles } from "meteor/alanning:roles";

@Injectable()
export class RoleService {

  constructor(private schemaService: SchemaService, private displayNamePipe: DisplayNamePipe) {
  }

  getRoles(thing): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('roles').subscribe(() => {
      let roles: any = Roles.getAllRoles().fetch();

      let roleArray = [];

      roles.forEach(role => {
        roleArray.push(
          {
            _id: role._id,
            parent: "roles",
            title: role.name,
            type: "Role"
          });
      });

      this.schemaService.fixup(roleArray, true);

      subject.next(roleArray);
    });

    return subject;
  }
}
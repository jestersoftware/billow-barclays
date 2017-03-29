import { Meteor } from 'meteor/meteor';

import { MongoObservable } from 'meteor-rxjs';

import { Roles } from "meteor/alanning:roles";

export const Things = new MongoObservable.Collection<any>('things');

function allow() {
  // return !!Meteor.user();
  return false;
}

Things.allow({
  insert: allow,
  update: allow,
  remove: allow
});

export class Security {
  checkRole(id, role, userId): boolean {
    let roleId = id;
    while (roleId) {
      if (Roles.userIsInRole(userId, [role], roleId)) {
        return true;
      }
      let thing = Things.findOne(roleId);
      roleId = thing ? thing.parent : null;
    }
    return false;
  }
}
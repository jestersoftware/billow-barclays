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

  // Check all parents and all refs to see if they match roles for the user
  checkRole(parentId: string, roles: Array<any>, userId: string, refFlag: boolean = false): boolean {
    let _parentId = parentId, _ref;

    while (_parentId) {
      if (userId && roles && Roles.userIsInRole(userId, roles, _parentId)) {
        return true;
      }
      if (refFlag) {
        _ref = Things.findOne({ reference: { _id: _parentId } });
      }
      if (_ref) {
        _parentId = _ref.parent;
      }
      else {
        let thing = Things.findOne(_parentId);
        if (thing 
            && thing.type === "Web Site" 
            && roles.length === 1 
            && roles[0] === "view") {
          return true;
        }
        _parentId = thing ? thing.parent : null;
      }
    }

    if(!refFlag)
      return this.checkRole(parentId, roles, userId, true);
    else
      return false;
  }
}
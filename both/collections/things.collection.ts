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

    if (!refFlag)
      return this.checkRole(parentId, roles, userId, true);
    else
      return false;
  }

  setPermissions(things, parentId) {
    let isParentEditable = this.checkRole(parentId, ["update"], Meteor.userId());

    things.forEach(thing1 => {
      let isThingEditable = false;

      // If we can't edit the parent, can we edit the thing itself?
      if (!isParentEditable) {
        isThingEditable = this.checkRole(thing1._id, ["update"], Meteor.userId());
      }

      thing1.session.editable = isParentEditable || isThingEditable;
    });
  }

  getChildrenIdArray(thing) {
    // TODO refactor to share with Things pub
    let _ids = [ thing.parent ];

    function addChildren(parentIds, parentRefIds, parentQuery) {
      const selector =
        {
          $or:
          [
            {
              parent: { $in: parentIds }
            },
            {
              _id: { $in: parentRefIds }
            }
          ]
        };

      let cursor = Things.find(selector).cursor;

      let ids_map = cursor.map(thing => {
        return {
          _id: thing._id,
          ref_id: thing.reference && thing.reference._id ? thing.reference._id : ''
        };
      });

      let ids = ids_map.map(thing => { return thing._id });
      let ref_ids = ids_map.map(thing => { return thing.ref_id });

      if (ids.length || ref_ids.length) {
        Array.prototype.push.apply(parentQuery, ids);

        addChildren(ids, ref_ids, parentQuery);
      }
    }

    addChildren(_ids, [], _ids);

    return _ids;
  }
}
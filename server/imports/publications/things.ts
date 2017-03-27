import { Meteor } from "meteor/meteor";
// import { Counts } from "meteor/tmeasday:publish-counts";

import { Roles } from "meteor/alanning:roles";

import { Things } from "./../../../both/collections/things.collection";
// import { Things } from "./../collections/things.collection";

// interface Options {
//   [key: string]: any;
// }

function checkRole(id) {
  let roleId = id;
  while (roleId) {
    if (Roles.userIsInRole(this.userId, ["view"], roleId)) {
      return true;
    }
    let thing = Things.findOne(roleId);
    roleId = thing ? thing.parent : null;
  }
  return false;
}

Meteor.publish("thing.children", function (id: string, refId?: string /*, options: Options*/) {

  let _id = id, _refId = refId, _groups;

  check(_id, String);

  if (!checkRole.call(this, _id)) {
    _id = null;
  }
  //else -> Has access to parent, so has access to children

  if (_refId) {
    check(_refId, String);

    if (!checkRole.call(this, _refId)) {
      _refId = null;
    }
  }

  if (!_id && !_refId) {
    if (id === "Root") {
      _id = "Root";
      _groups = Roles.getGroupsForUser(this.userId, "view");
    }
    else {
      this.stop();
      return;
    }
  }

  const selector = buildQuery.call(this, _refId, _id, _groups);

  // Counts.publish(this, "numberOfParties", Things.collection.find(/*selector*/), { noReady: true });

  return Things.find(selector /*, options*/);
});

Meteor.publish("thing", function (id: string) {
  check(id, String);

  if (!checkRole(id)) {
    this.stop();
    return;
  }

  const selector = buildQuery.call(this, id);

  return Things.findOne(selector);
});

function buildQuery(id?: string, parentId?: string, groups?: Array<any>): Object {

  // const isAvailable = {
  //   $or: [
  //     // // {
  //     // //   // thing is public
  //     // //   public: true
  //     // // },
  //     // {
  //     //   // thing is public
  //     //   type: "Web Site"
  //     // },
  //     // // or
  //     // {
  //     //   // current user is the owner
  //     //   $and: [
  //     //     {
  //     //       "meta.creator": this.userId
  //     //     }, 
  //     //     {
  //     //       "meta.creator": 
  //     //       {
  //     //         $exists: true
  //     //       }
  //     //     }
  //     //   ]
  //     // },
  //     // // or
  //     // {
  //     //   // current user is the owner
  //     //   $and: [
  //     //     {
  //     //       uid: this.userId
  //     //     }, 
  //     //     {
  //     //       uid: 
  //     //       {
  //     //         $exists: true
  //     //       }
  //     //     }
  //     //   ]
  //     // }
  //     // /*,
  //     // {
  //     //   $and: [
  //     //     { invited: this.userId },
  //     //     { invited: { $exists: true } }
  //     //   ]
  //     // }*/
  //   ]
  // };

  let query: any = { $and: [{ $or: [] }] };

  if (id) {
    query.$and[0].$or.push(
      {
        _id: id
      }
    );
  }

  if (parentId) {
    query.$and[0].$or.push(
      {
        parent: parentId
      }
    );
  }

  if (groups) {
    query.$and.push(
      {
        _id: { $in: groups }
      }
    );
  }

  return query;
}
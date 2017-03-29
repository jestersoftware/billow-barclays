import { Meteor } from "meteor/meteor";
// import { Counts } from "meteor/tmeasday:publish-counts";

import { Roles } from "meteor/alanning:roles";

import { Things, Security } from "./../../../both/collections/things.collection";

// interface Options {
//   [key: string]: any;
// }

Meteor.publish("thing.children", function (parentId: string, refId?: string /*, options: Options*/) {

  let _parentId = parentId, _refId = refId, _groups;

  check(_parentId, String);

  let security = new Security();

  // If we can access parent, we can access children
  if (!security.checkRole(_parentId, ["view"], this.userId)) {
    _parentId = null;
  }
  
  // if (_refId) {
  //   check(_refId, String);

  //   if (!security.checkRole.call(this, _refId, "view", this.userId)) {
  //     _refId = null;
  //   }
  // }

  if (!_parentId /*&& !_refId*/) {
    if (parentId === "Root") {
      _parentId = "Root";
      _groups = Roles.getGroupsForUser(this.userId, "view");
    }
    else {
      this.stop();
      return;
    }
  }

  const selector = buildQuery.call(this, _refId, _parentId, _groups);

  // Counts.publish(this, "numberOfParties", Things.collection.find(/*selector*/), { noReady: true });

  return Things.find(selector /*, options*/);
});

Meteor.publish("thing", function (id: string) {
  check(id, String);

  let security = new Security();

  if (!security.checkRole(id, ["view"], this.userId)) {
    this.stop();
    return;
  }

  const selector = buildQuery.call(this, id);

  return Things.find(selector);
});

Meteor.publish("thing.query", function (query: Object) {
  check(query, Object);

  // TODO!!

  // let security = new Security();

  // if (!security.checkRole(id, ["view"], this.userId)) {
  //   this.stop();
  //   return;
  // }

  const selector = query; //buildQuery.call(this, id);

  return Things.find(selector);
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
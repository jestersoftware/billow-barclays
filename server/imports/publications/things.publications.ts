import { Meteor } from "meteor/meteor";

// import { Counts } from "meteor/tmeasday:publish-counts";

import { Roles } from "meteor/alanning:roles";

import { publishComposite } from 'meteor/reywood:publish-composite';

import { Things, Security } from "./../../../both/collections/things.collection";

// import * as _ from 'underscore';

// interface Options {
//   [key: string]: any;
// }

// Meteor.publish("thing.children", function (parentId: string, refId?: string /*, options: Options*/) {

//   let _parentId = parentId, _refId = refId, _groups;

//   check(_parentId, String);

//   let security = new Security();

//   // If we can access parent, we can access children
//   if (!security.checkRole(_parentId, ["view"], this.userId)) {
//     _parentId = null;
//   }

//   // TODO??
//   // if (_refId) {
//   //   check(_refId, String);

//   //   if (!security.checkRole.call(this, _refId, "view", this.userId)) {
//   //     _refId = null;
//   //   }
//   // }

//   if (!_parentId /*&& !_refId*/) {
//     if (parentId === "Root") {
//       _parentId = "Root";
//       _groups = Roles.getGroupsForUser(this.userId, "view");
//     }
//     else {
//       return this.ready();
//     }
//   }

//   const selector = buildQuery.call(this, _refId, _parentId, _groups);

//   // Counts.publish(this, "numberOfParties", Things.collection.find(/*selector*/), { noReady: true });

//   return Things.find(selector /*, options*/).cursor;
// });

publishComposite('thing.all', function () {

  let _groups = Roles.getGroupsForUser(this.userId, "view");   // TODO: change to cursor?

  let _selector =
    {
      $or:
      [
        {
          _id: { $in: _groups }
        },
        {
          type: 'Web Site'
        }
      ]
    };

  let _cursor = Things.find(_selector).cursor;

  var _query = {
    find: function () {
      return _cursor;
    },
    children: []
  };

  let _ids = _cursor.map(thing => { return thing._id; });

  if (!_ids.length)
    return this.ready();

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

      let query = {
        find: function () {
          return cursor;
        }
      };

      parentQuery.push(query);

      addChildren(ids, ref_ids, parentQuery);
    }
  }

  addChildren(_ids, [], _query.children);

  return _query;
});

// Meteor.publish("thing", function (id: string) {
//   check(id, String);

//   let security = new Security();

//   if (!security.checkRole(id, ["view"], this.userId)) {
//     return this.ready();
//   }

//   const selector = buildQuery.call(this, id);

//   return Things.find(selector);
// });

// Meteor.publish("thing.query", function (query: Object) {
//   check(query, Object);

//   // TODO!!

//   // let security = new Security();

//   // if (!security.checkRole(id, ["view"], this.userId)) {
//   //   this.stop();
//   //   return;
//   // }

//   const selector = query; //buildQuery.call(this, id);

//   return Things.find(selector);
// });

// function buildQuery(id?: string, parentId?: string, groups?: Array<any>): Object {

//   // const isAvailable = {
//   //   $or: [
//   //     // // {
//   //     // //   // thing is public
//   //     // //   public: true
//   //     // // },
//   //     // {
//   //     //   // thing is public
//   //     //   type: "Web Site"
//   //     // },
//   //     // // or
//   //     // {
//   //     //   // current user is the owner
//   //     //   $and: [
//   //     //     {
//   //     //       "meta.creator": this.userId
//   //     //     }, 
//   //     //     {
//   //     //       "meta.creator": 
//   //     //       {
//   //     //         $exists: true
//   //     //       }
//   //     //     }
//   //     //   ]
//   //     // },
//   //     // // or
//   //     // {
//   //     //   // current user is the owner
//   //     //   $and: [
//   //     //     {
//   //     //       uid: this.userId
//   //     //     }, 
//   //     //     {
//   //     //       uid: 
//   //     //       {
//   //     //         $exists: true
//   //     //       }
//   //     //     }
//   //     //   ]
//   //     // }
//   //     // /*,
//   //     // {
//   //     //   $and: [
//   //     //     { invited: this.userId },
//   //     //     { invited: { $exists: true } }
//   //     //   ]
//   //     // }*/
//   //   ]
//   // };

//   let query: any = { $and: [{ $or: [] }] };

//   if (id) {
//     query.$and[0].$or.push(
//       {
//         _id: id
//       }
//     );
//   }

//   if (parentId) {
//     query.$and[0].$or.push(
//       {
//         parent: parentId
//       }
//     );
//   }

//   if (groups) {
//     query.$and.push(
//       {
//         _id: { $in: groups }
//       }
//     );
//   }

//   return query;
// }
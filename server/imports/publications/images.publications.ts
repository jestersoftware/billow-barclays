import { Meteor } from 'meteor/meteor';

import { Roles } from "meteor/alanning:roles";

import { Thumbs, Images } from './../../../both/collections/images.collection';

import { Things, Security } from "./../../../both/collections/things.collection";

Meteor.publish('thumbs', function () {
  
  // TODO security - copy images
  
  return Thumbs.collection.find({
    originalStore: 'images'/*,
    originalId: {
      $in: ids
    }*/
  });
});

Meteor.publish('images', function () {

  // TODO?
  if(Roles.userIsInRole(this.userId, ["view"], "SoSsmkkSJGkoXp8B2")) { // "System"
    return Images.collection.find({});
  }

  // TODO refactor to share with Things pub
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
      Array.prototype.push.apply(parentQuery, ids);

      addChildren(ids, ref_ids, parentQuery);
    }
  }

  addChildren(_ids, [], _ids);

  // TODO? add "userId"/creator can always see images??
  let _selector1 =
    {
      // $or:
      // [
      //   {
      //     userId: this.userId
      //   },
      //   {
          parent: { $in: _ids }
      //   }
      // ]
    };

  return Images.collection.find(_selector1);
});
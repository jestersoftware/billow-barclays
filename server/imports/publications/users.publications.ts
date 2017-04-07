import { Meteor } from 'meteor/meteor';

import { Roles } from "meteor/alanning:roles";

// import { Users } from './../../../both/collections/users.collection';

Meteor.publish('users', function (/*id: string*/) {
  // const user = Users.find(id);

  // if (!user) {
  //   throw new Meteor.Error('404', 'No such user');
  // }

  // return Meteor.users.find({
  //   _id: {
  //     $nin: party.invited || [],
  //     $ne: this.userId
  //   }
  // });

  let query = {};

  if(!Roles.userIsInRole(this.userId, ["view"], "SoSsmkkSJGkoXp8B2")) { // "System"
    query = {
      _id: this.userId
    };
  }  

  return Meteor.users.find(query);
});

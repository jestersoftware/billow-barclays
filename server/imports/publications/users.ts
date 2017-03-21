import { Meteor } from 'meteor/meteor';

import { Users } from './../../../both/collections/users.collection';

Meteor.publish('users', function (id: string) {
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

  return Meteor.users.find({
    _id: id
  });

});

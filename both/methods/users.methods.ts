import { Meteor } from 'meteor/meteor';

import { Users } from './../collections/users.collection';

Meteor.methods({
  'users.update.view': function (thing: any) {
    // console.log('users.update.view', thing.title);

    check(thing, Object); // TODO

    let viewEntry = { $set: { } };

    viewEntry.$set["views.things." + thing._id] = { view: thing.view };

    Users.collection.update(this.userId, viewEntry);
  }
});
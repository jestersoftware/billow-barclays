import { Meteor } from 'meteor/meteor';

import { MongoObservable } from 'meteor-rxjs';

export const Things = new MongoObservable.Collection<any>('things');
// export const Things = new Mongo.Collection<any>('things');

function loggedIn() {
  return !!Meteor.user();
}

Things.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});

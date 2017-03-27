import { Meteor } from 'meteor/meteor';

import { MongoObservable } from 'meteor-rxjs';

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


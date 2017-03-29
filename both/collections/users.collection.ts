import { Meteor } from 'meteor/meteor';

import { MongoObservable } from 'meteor-rxjs';

export const Users = MongoObservable.fromExisting(Meteor.users);

import { Meteor } from 'meteor/meteor';

import { loadThings } from './imports/fixtures/things';

import './imports/publications/users';
import './imports/publications/things';
import './imports/publications/images';
import './imports/publications/roles.publications';

import './../both/methods/things.methods';

Meteor.startup(() => {
  loadThings();
});

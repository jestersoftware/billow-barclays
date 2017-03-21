import { Meteor } from 'meteor/meteor';

import { loadThings } from './imports/fixtures/things';

import './imports/publications/things';
import './imports/publications/users';
import './../both/methods/things.methods';
import './imports/publications/images';

Meteor.startup(() => {
  // debugger;
  loadThings();
});

import { Meteor } from 'meteor/meteor';

import { loadThings } from './imports/fixtures/things.fixtures';

import './imports/publications/users.publications';
import './imports/publications/things.publications';
import './imports/publications/images.publications';
import './imports/publications/roles.publications';

import './../both/methods/things.methods';

Meteor.startup(() => {
  loadThings();
});

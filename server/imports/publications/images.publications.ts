import { Meteor } from 'meteor/meteor';

import { Thumbs, Images } from './../../../both/collections/images.collection';

Meteor.publish('thumbs', function(/*ids: string[]*/) {
  // TODO security
  return Thumbs.collection.find({
    originalStore: 'images'/*,
    originalId: {
      $in: ids
    }*/
  });
});

Meteor.publish('images', function() {
  // TODO security
  return Images.collection.find({});
});
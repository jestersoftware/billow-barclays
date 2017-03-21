import { Meteor } from 'meteor/meteor';
// import { Counts } from 'meteor/tmeasday:publish-counts';

import { Things } from './../../../both/collections/things.collection';

interface Options {
  [key: string]: any;
}

Meteor.publish('things', function (options: Options /*, location?: string*/) {
  const selector = buildQuery.call(this, null /*, location*/);

  // Counts.publish(this, 'numberOfParties', Things.collection.find(/*selector*/), { noReady: true });

  return Things.find(selector, options);
  // return Things.find();
});

Meteor.publish('thing', function (id: string) {
  return Things.find(buildQuery.call(this, id));
  // return Things.find({_id: id});  
});

function buildQuery(id?: string /*, location?: string*/): Object {
  const isAvailable = {
    $or: [
      {
        // thing is public
        public: true
      },
      {
        // thing is public
        type: "Web Site"
      },
      // or
      {
        // current user is the owner
        $and: [
          {
            "meta.creator": this.userId
          }, 
          {
            "meta.creator": 
            {
              $exists: true
            }
          }
        ]
      },
      // or
      {
        // current user is the owner
        $and: [
          {
            uid: this.userId
          }, 
          {
            uid: 
            {
              $exists: true
            }
          }
        ]
      }/*,
    {
      $and: [
        { invited: this.userId },
        { invited: { $exists: true } }
      ]
    }*/]
  };

  if (id) {
    return {
      // only single thing
      $and: [{
        _id: id
      },
        isAvailable
      ]
    };
  }

  // const searchRegEx = { '$regex': '.*' + (location || '') + '.*', '$options': 'i' };

  return isAvailable;

  // return {
  //   $and: [{
  //     'location.name': searchRegEx
  //   },
  //     isAvailable
  //   ]
  // };
}
import { Meteor } from 'meteor/meteor';

// import {Email} from 'meteor/email';
// import {check} from 'meteor/check';

import { Things, Security } from './../collections/things.collection';

// function getContactEmail(user:Meteor.User):string {
//   if (user.emails && user.emails.length)
//     return user.emails[0].address;

//   return null;
// }

Meteor.methods({
  "things.insert": function (thing: any) {
    console.log('things.insert starting for thing:', thing);

    const security = new Security();

    if (!security.checkRole(thing.parent, ["update"], this.userId)) {
      throw new Meteor.Error('403', 'No permissions');
    }

    check(thing, Object); // TODO

    if (!thing.meta) {
      thing.meta = {};
    }

    thing.meta.creator = this.userId;
    thing.meta.modifier = this.userId;

    if (!thing.order) {
      thing.order = {};
    }

    let max_thing = Things.collection.findOne({ parent: thing.parent }, { sort: { "order.index": -1 } });
    let max_index = max_thing && max_thing.order && max_thing.order.index ? max_thing.order.index : '0';

    thing.order.index = (parseInt(max_index) + 1).toString();

    // Things.find({}, { sort: { "order.index": -1 } }).fetch()

    // // let party = Parties.collection.findOne(id);

    // // if (!party)
    // //   throw new Meteor.Error('404', 'No such party!');

    // // if (party.public)
    // //   throw new Meteor.Error('400', 'That party is public. No need to invite people.');

    // // if (party.owner !== this.userId)
    // //   throw new Meteor.Error('403', 'No permissions!');

    // // if (userId !== party.owner && (party.invited || []).indexOf(userId) == -1) {


    Things.collection.insert(thing);


    // //   let from = getContactEmail(Meteor.users.findOne(this.userId));
    // //   let to = getContactEmail(Meteor.users.findOne(userId));

    // //   if (Meteor.isServer && to) {
    // //     Email.send({
    // //       from: 'noreply@socially.com',
    // //       to: to,
    // //       replyTo: from || undefined,
    // //       subject: 'PARTY: ' + party.name,
    // //       text: `Hi, I just invited you to ${party.name} on Socially.
    // //                     \n\nCome check it out: ${Meteor.absoluteUrl()}\n`
    // //     });
    // //   }
    // // }
  },
  "things.update": function (id: string, thing: any) {
    console.log('things.update', id, thing);

    const security = new Security();

    if (!security.checkRole(id, ["update"], this.userId)) {
      throw new Meteor.Error('403', 'No permissions');
    }

    check(id, String);
    check(thing, Object); // TODO

    if (!thing.meta) {
      thing.meta = {};
    }

    thing.meta.modifier = this.userId;

    Things.collection.update(id, { $set: thing });
  },
  "things.remove": function (id: string) {
    console.log('things.remove', id);

    const security = new Security();

    if (!security.checkRole(id, ["update"], this.userId)) {
      throw new Meteor.Error('403', 'No permissions');
    }

    check(id, String);
    // check(thing, Object); // TODO

    // if (!thing.meta) {
    //   thing.meta = {};
    // }

    // thing.meta.modifier = this.userId;

    Things.collection.remove(id);
  }
});
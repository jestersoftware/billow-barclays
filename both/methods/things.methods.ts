import { Meteor } from 'meteor/meteor';

// import {Email} from 'meteor/email';
// import {check} from 'meteor/check';

import { Things } from './../collections/things.collection';

// function getContactEmail(user:Meteor.User):string {
//   if (user.emails && user.emails.length)
//     return user.emails[0].address;

//   return null;
// }

Meteor.methods({
    "things.insert": function (thing: any) {
        // console.log('things.insert');
        // console.log(thing);
        // check(id, String);
        // check(userId, String);

        // let party = Parties.collection.findOne(id);

        // if (!party)
        //   throw new Meteor.Error('404', 'No such party!');

        // if (party.public)
        //   throw new Meteor.Error('400', 'That party is public. No need to invite people.');

        // if (party.owner !== this.userId)
        //   throw new Meteor.Error('403', 'No permissions!');

        // if (userId !== party.owner && (party.invited || []).indexOf(userId) == -1) {
        Things.collection.insert(thing);

        //   let from = getContactEmail(Meteor.users.findOne(this.userId));
        //   let to = getContactEmail(Meteor.users.findOne(userId));

        //   if (Meteor.isServer && to) {
        //     Email.send({
        //       from: 'noreply@socially.com',
        //       to: to,
        //       replyTo: from || undefined,
        //       subject: 'PARTY: ' + party.name,
        //       text: `Hi, I just invited you to ${party.name} on Socially.
        //                     \n\nCome check it out: ${Meteor.absoluteUrl()}\n`
        //     });
        //   }
        // }
    },
    "things.update": function (id: string, thing: any) {
        // console.log('things.update: ' + id);
        // console.log(thing);

        // check(id, String);
        // check(userId, String);

        // let party = Parties.collection.findOne(id);

        // if (!party)
        //   throw new Meteor.Error('404', 'No such party!');

        // if (party.public)
        //   throw new Meteor.Error('400', 'That party is public. No need to invite people.');

        // if (party.owner !== this.userId)
        //   throw new Meteor.Error('403', 'No permissions!');

        // if (userId !== party.owner && (party.invited || []).indexOf(userId) == -1) {
        Things.collection.update(id, { $set: thing });

        //   let from = getContactEmail(Meteor.users.findOne(this.userId));
        //   let to = getContactEmail(Meteor.users.findOne(userId));

        //   if (Meteor.isServer && to) {
        //     Email.send({
        //       from: 'noreply@socially.com',
        //       to: to,
        //       replyTo: from || undefined,
        //       subject: 'PARTY: ' + party.name,
        //       text: `Hi, I just invited you to ${party.name} on Socially.
        //                     \n\nCome check it out: ${Meteor.absoluteUrl()}\n`
        //     });
        //   }
        // }
    }
});
import { Meteor } from 'meteor/meteor';

import { Roles } from "meteor/alanning:roles";

Meteor.publish('roles', function () {
  let query = {};

  if(Roles.userIsInRole(this.userId, ["view"], "SoSsmkkSJGkoXp8B2")) {
  }
  else
  {
    // TODO
    // query = {
    //   _id: this.userId
    // };
  }
  
  return Roles.getAllRoles();
});

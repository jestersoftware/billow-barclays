import { Injectable } from '@angular/core';

import { Subject } from "rxjs/Rx";

import { UserService } from './user.service';

import { RoleService } from './role.service';

import { ThingService } from './thing.service';

import { ThingImageService } from './thing.image.service';

@Injectable()
export class AdminService {

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private thingService: ThingService,
    private thingImageService: ThingImageService) {
  }

  getChildren(thing): Subject<any> {

    if (thing.reference && thing.reference._id) {
      // TODO
      switch (thing.reference._id) {
        case "users":
          return this.userService.getUsers(thing);
        case "roles":
          return this.roleService.getRoles(thing);
        case "images":
          return this.thingImageService.getImages(thing);
      }
    }

    return this.thingService.getChildren(thing);
  }

  delete(thing) {

    // TODO
    switch (thing.type) {
      case "Image":
        return this.thingImageService.removeFile(thing._id);
    }

    thing.session.error = new Error("Delete not supported.");
  }
}
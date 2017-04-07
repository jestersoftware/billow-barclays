import { Injectable } from '@angular/core';

import { Observable, Subscription, Subject } from "rxjs/Rx";

import { MeteorObservable } from "meteor-rxjs";

import { SchemaService } from './schema.service';

import { Thumbs, Images } from './../../../both/collections/images.collection';

import { Things, Security } from "./../../../both/collections/things.collection";

@Injectable()
export class ThingImageService {

  security = new Security();
  subscription: Subscription;

  constructor(
    private schemaService: SchemaService) {
  }

  removeFile(id) {
    MeteorObservable.call('images.remove', id).subscribe({
      next: () => {
      },
      error: (e: Error) => {
        console.log(e);
      }
    });
  }

  getImage(imageThing): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('images').subscribe(() => {
      let image = Images.findOne({ _id: imageThing._id });
      if (image)
        subject.next(image);
    });

    return subject;
  }

  getThumb(imageThing): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('thumbs').subscribe(() => {
      let thumb = Thumbs.findOne({ originalId: imageThing._id });
      if (thumb)
        subject.next(thumb);
    });

    return subject;
  }

  getImages(thing): Subject<any> {
    if (!this.subscription)
      this.subscription = MeteorObservable.subscribe('images').subscribe();

    return Observable.create(observer => {
      let query: any = {};

      if (thing.reference && thing.reference._id && thing.reference._id === "images" && thing.parent !== "SoSsmkkSJGkoXp8B2") {
        query = { parent: { $in: this.security.getChildrenIdArray(thing) } };
      }

      Images.find(query, { sort: { "uploadedAt": -1 } }).subscribe(images => {
        let uninitialized = [];

        images.forEach(image => {
          if (!image.session || !image.session.initialized)
            uninitialized.push(image);
        });

        if (uninitialized.length > 0) {
          this.fixup(uninitialized);

          this.schemaService.fixup(uninitialized, true, thing);

          this.security.setPermissions(uninitialized, thing._id);

          observer.next(images);
        }
      });
    });
  }

  fixup(things) {
    things.forEach(thing => {
      if (!thing.parent)
        thing.parent = "images";

      if (!thing.title)
        thing.title = thing.name;

      thing.type = "Image";

      thing.background = { path: thing.path + "?token=" + thing.token, previewPath: '' };

      this.getThumb(thing).subscribe(thumb => {
        thing.background.previewPath = thumb.path + "?token=" + thumb.token;
      });
    });
  }
}
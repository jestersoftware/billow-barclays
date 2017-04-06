import { Injectable } from '@angular/core';

import { Observable, Subscription, Subject } from "rxjs/Rx";

import { MeteorObservable } from "meteor-rxjs";

import { ThingService } from './thing.service';

import { SchemaService } from './schema.service';

import { Thumbs, Images } from './../../../both/collections/images.collection';

import { upload } from './../../../both/methods/images.methods';

import { Things, Security } from "./../../../both/collections/things.collection";

@Injectable()
export class ThingImageService {

  security = new Security();
  thingsSubscription: Subscription;

  constructor(
    private schemaService: SchemaService,
    private thingService: ThingService) {
  }

  uploadFile(file): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      upload(file)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
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
      let thingsSub = Images.find({ _id: imageThing._id });
      thingsSub.subscribe(things => {
        subject.next(things);
      });
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
    if (!this.thingsSubscription)
      this.thingsSubscription = MeteorObservable.subscribe('images').subscribe();

    return Observable.create(observer => {

      Images.find().subscribe(images => {
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

  fixup(images) {
    images.forEach(image => {
      if (!image.parent)
        image.parent = "images";

      if (!image.title)
        image.title = image.name;

      image.type = "Image";

      if (!image.background) {
        image.background = { path: image.path, previewPath: '' };
        this.getThumb(image).subscribe(thumb => {
          image.background.previewPath = thumb.path;
        });
      }
    });
  }

  onFile($event, thing, prop, uploader) {
    if ($event.target.files.length > 0) {
      // Get last added item
      let item = uploader.queue[uploader.queue.length - 1];

      // Set custom alias for tracking purposes
      // TODO: could break, use separate array instead??
      let alias = thing._id + ":" + prop.key;

      // See if same item already queued
      // let existing = this.files.find(file => file.prop === key);
      let existing = uploader.queue.find(q => q.alias === alias);

      // If so, remove it
      if (existing) {
        uploader.removeFromQueue(existing);
        // existing.item = item;
      }
      // else {
      // existing = { prop: prop.key, item: item }
      // this.files.push(existing);
      // }
      item.alias = alias;

      if (prop.preview)
        thing[prop.key][prop.name] = item.file.name;
    }
  }

  upload(uploader, thing) {
    let queueLength = uploader.queue.length;

    if (queueLength > 0) {
      let count = 0;

      uploader.queue.filter(qItem => qItem.alias.split(":")[0] === thing._id).forEach(item => {

        this.uploadFile(item._file).then((result) => {

          count++;

          let propKey = item.alias.split(":")[1];

          if (!thing[propKey])
            thing[propKey] = {};

          thing[propKey]._id = result._id;
          thing[propKey].store = result.store;
          thing[propKey].name = result.name;
          thing[propKey].type = result.type;
          thing[propKey].path = result.path;

          let param: any = {
            _id: thing._id
          };

          param[propKey] = thing[propKey];

          this.thingService.update(param);

          this.getThumb({ _id: result._id }).subscribe((thumb) => {
            param[propKey].previewPath = thumb.path;
            this.thingService.update(param);
          });

          if (count >= queueLength) {
            setTimeout(() => {
              uploader.clearQueue();
            }, 0);
          }
        })
          .catch((error) => {
            count++;

            console.log("Error uploading file", error);

            if (count >= queueLength) {
              setTimeout(() => {
                uploader.clearQueue();
              }, 0);
            }
          });
      });
    }
  }
}
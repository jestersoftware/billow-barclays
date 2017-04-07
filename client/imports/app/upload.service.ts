import { Injectable } from '@angular/core';

import { ThingService } from './thing.service';

import { ThingImageService } from './thing.image.service';

import { upload } from './../../../both/methods/images.methods';

@Injectable()
export class UploadService {

  thingsSubscription: Subscription;

  constructor(
    private thingService: ThingService,
    private thingImageService: ThingImageService) {
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

  uploadFile(thing, file): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      upload(thing, file)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
  }

  upload(uploader, thing) {
    let queueLength = uploader.queue.length;

    if (queueLength > 0) {
      let count = 0;

      uploader.queue.filter(queue_item => queue_item.alias.split(":")[0] === thing._id).forEach(item => {

        this.uploadFile(thing, item._file).then((result) => {

          count++;

          let propKey = item.alias.split(":")[1];

          if (!thing[propKey])
            thing[propKey] = {};

          thing[propKey]._id = result._id;
          thing[propKey].store = result.store;
          thing[propKey].name = result.name;
          thing[propKey].type = result.type;
          thing[propKey].path = result.path; // TODO? remove because we're doing this in thing.service now

          let param: any = {
            _id: thing._id
          };

          param[propKey] = thing[propKey];

          this.thingService.update(param);

          this.thingImageService.getThumb({ _id: result._id }).subscribe((thumb) => {
            param[propKey].previewPath = thumb.path;  // TODO? remove because we're doing this in thing.service now
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
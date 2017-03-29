import { Injectable } from '@angular/core';

import { Observable, Subject } from "rxjs/Rx";

import { MeteorObservable } from "meteor-rxjs";

import { ThingService } from './thing.service';

import { SchemaService } from './schema.service';

import { Thumbs, Images } from './../../../both/collections/images.collection';

import { upload } from './../../../both/methods/images.methods';

@Injectable()
export class ThingImageService {

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

  getFileByKey(getParam): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('images').subscribe(() => {
      let thingsSub = Images.find({ _id: getParam._id });
      thingsSub.subscribe(things => {
        subject.next(things);
      });
    });

    return subject;
  }

  getThumb(getParam): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('thumbs', [getParam._id]).subscribe(() => {
      let thumb = Thumbs.findOne({ originalId: getParam._id });
      subject.next(thumb);
    });

    return subject;
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

          // console.log("Success uploading file", result);

          let propKey = item.alias.split(":")[1];

          if (!thing[propKey])
            thing[propKey] = {};

          // thing[alias].url = result.url;
          thing[propKey] = result; // TODO: pass all the data like this, or just some?

          let param: any = {
            _id: thing._id
          };

          param[propKey] = thing[propKey];

          this.thingService.update(param/*, null*/);

          this.getThumb({ _id: result._id }).subscribe((thumb) => {
            param[propKey].previewPath = thumb.path;
            this.thingService.update(param/*, null*/);
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
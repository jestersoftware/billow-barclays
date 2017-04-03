import { Injectable } from '@angular/core';

import { Observable, Subject } from "rxjs/Rx";

import { MeteorObservable } from "meteor-rxjs";

import { ThingService } from './thing.service';

import { SchemaService } from './schema.service';

import { Thumbs, Images } from './../../../both/collections/images.collection';

import { upload } from './../../../both/methods/images.methods';

import { Things, Security } from "./../../../both/collections/things.collection";

@Injectable()
export class ThingImageService {

  constructor(
    private schemaService: SchemaService,
    private thingService: ThingService) {
  }

  security = new Security();

  setPermissions(things, parentId) {
    let isParentEditable = this.security.checkRole(parentId, ["update"], Meteor.userId());

    things.forEach(thing1 => {
      let isThingEditable = false;

      // If we can't edit the parent, can we edit the thing itself?
      if (!isParentEditable) {
        isThingEditable = this.security.checkRole(thing1._id, ["update"], Meteor.userId());
      }

      thing1.session.editable = isParentEditable || isThingEditable;
    });
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

  getImages(thing): Subject<any> {
    let subject = new Subject();

    MeteorObservable.subscribe('images').subscribe(() => {
      // let images: any = Images.find().fetch(); // TODO Limit
      let imagesCursor = Images.find();

      // let imagesArray = [];

      // images.forEach(image => {
      //   imagesArray.push(
      //     {
      //       _id: image._id,
      //       parent: "images",
      //       title: image.name,
      //       type: "Image",
      //       background: { path: image.path, previewPath: image.path }
      //     });
      // });

      // this.schemaService.fixup(imagesArray, true);
      // this.setPermissions(imagesArray, thing._id);

      // subject.next(imagesArray);

      imagesCursor.subscribe(images => {

        // TODO fixup
        images.forEach(image => {

          if(!image.parent)
            image.parent = "images";

          if(!image.title)
            image.title = image.name;

          image.type = "Image";

          if(!image.background)
            image.background = { path: image.path, previewPath: image.path };

        });

        this.schemaService.fixup(images, true, thing);

        this.setPermissions(images, thing._id);

        subject.next(images);
      });

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

          // TODO: pass all the data, or just some?
          thing[propKey]._id = result._id;
          thing[propKey].store = result.store;
          thing[propKey].name = result.name;
          thing[propKey].type = result.type;
          thing[propKey].path = result.path;
          // thing[propKey] = result; 

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
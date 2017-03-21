import { Injectable } from '@angular/core';

import { Observable, Subject } from "rxjs/Rx";

import { MeteorObservable } from "meteor-rxjs";

import { SchemaService } from './schema.service';

import { ThingService } from './thing.service';

import { Thumbs, Images } from './../../../both/collections/images.collection';

import { upload } from './../../../both/methods/images.methods';

@Injectable()
export class ThingImageService {

  constructor(
    private schemaService: SchemaService,
    private thingService: ThingService) {
  }

  uploadFile(file): Promise<any> {
    console.log("uploadFile", file);

    let promise = new Promise((resolve, reject) => {

      upload(file)
        .then((result) => {
          // console.log("Success uploading file", result);

          resolve(result);
        })
        .catch((error) => {
          // console.log("Error uploading file", error);

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

  
}
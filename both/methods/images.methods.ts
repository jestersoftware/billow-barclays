import { UploadFS } from 'meteor/jalik:ufs';

import { Images, ImagesStore } from './../collections/images.collection';

export function upload(thing: any, data: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const file = {
      name: data.name,
      type: data.type,
      size: data.size,
      parent: thing._id
    };

    const upload = new UploadFS.Uploader({
      data,
      file,
      store: ImagesStore,
      onError: reject,
      onComplete: resolve
    });

    upload.start();
  });
}

Meteor.methods({
  'images.remove': function (id: any) {
    check(id, String); // TODO

    Images.collection.remove(id);
  }
});

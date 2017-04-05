import { Meteor } from 'meteor/meteor';

import { MongoObservable } from 'meteor-rxjs';

import { UploadFS } from 'meteor/jalik:ufs';

export const Images = new MongoObservable.Collection<any>('images');
export const Thumbs = new MongoObservable.Collection<any>('thumbs');

function loggedIn(userId) {
  return !!userId;
}

export const ThumbsStore = new UploadFS.store.GridFS({
  collection: Thumbs.collection,
  name: 'thumbs',
  permissions: new UploadFS.StorePermissions({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
  }),
  transformWrite(from, to, fileId, file) {
    // console.log('transform write started', fileId /*, from*/);

    var ImageJS = require("imagejs");

    let bitmap = new ImageJS.Bitmap();

    let fileType = bitmap._deduceFileType(file.name);

    bitmap.read(from, { type: fileType })
      .then(function () {

        // console.log('bitmap read');

        // If it's bigger than 500 x 500
        if (bitmap._data && bitmap._data.width && (bitmap._data.width * bitmap._data.height > 500 * 500)) {

          var thumbnail = bitmap.resize({
            width: 256,
            height: 256,
            algorithm: "bilinearInterpolation",
            fit: "crop"
          });

          thumbnail.write(to, { type: fileType })
            .then(function () {
              // console.log('bitmap has been written and stream ended');
            });
        }
      });

    // console.log('transform write ended', fileId);
  }
});

export const ImagesStore = new UploadFS.store.GridFS({
  collection: Images.collection,
  name: 'images',
  filter: new UploadFS.Filter({
    minSize: 1,
    maxSize: 1024 * 5000, // 5MB
    contentTypes: ['image/*'],
    extensions: ['jpg', 'png']
  }),
  copyTo: [
    ThumbsStore
  ],
  permissions: new UploadFS.StorePermissions({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
  })
});

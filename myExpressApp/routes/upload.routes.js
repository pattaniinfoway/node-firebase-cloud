
const express = require('express');
const router = express.Router();
var path = require('path');
const {format} = require('util');




const app = express();
const googleStorage = require('@google-cloud/storage');
const {Storage} = require('@google-cloud/storage');
app.use('/upload',express.static(path.join(__dirname,'/uploads')));
const Multer = require('multer');
const { Console } = require('console');



const storage = new Storage({
    projectId: 'cxmo-node',
    credentials: require('../cxmo-node-firebase-adminsdk-c2sgp-9079032fc5.json'),
    predefinedAcl: 'publicRead',
    cacheControl: 'public, max-age=31536000'
   
  });

const bucket = storage.bucket("gs://cxmo-node.appspot.com");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});



/**
 * Adding new file to the storage
 */
router.post('/upload', multer.single('file'), (req, res) => {
  console.log('Upload Image');

  let file = req.file;
  if (file) {
    uploadImageToStorage(file).then((success) => {
      res.status(200).send({
        status: 'success'
      });
    }).catch((error) => {
        res.status(500).send({
            status: error
          });
    });
  }
});

/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
const uploadImageToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file');
    }
    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);
    

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', (error) => {
        console.log(error);
      reject(error);
    });

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      //const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
      );
      console.log(publicUrl);
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
}
module.exports = router; 
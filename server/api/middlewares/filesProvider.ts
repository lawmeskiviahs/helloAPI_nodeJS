import dotenv from 'dotenv';
dotenv.config();
import multer = require('multer');
import aws = require('aws-sdk');
import multerS3 = require('multer-s3');
import { v4 } from 'uuid';

aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.REGION,
});

const s3 = new aws.S3();

const imageFilter = (_req: any, file: any, cb: any) => {
  if (!_req.body.folderName) {
    return cb(new Error('Please send folder name!'), false);
  }
  const foldername: string = _req.body.folderName;
  if (foldername === 'video') {
    if (!file.originalname.match(/\.(mp4|mov)$/)) {
      return cb(new Error('Only mp4|mov Video files are allowed!'), false);
    }
  } else {
    if (!file.originalname.match(/\.(JPG|jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only Image files are allowed!'), false);
    }
  }
  cb(null, true);
};

export const uploadBannerImages = multer({
  fileFilter: imageFilter,
  // storage
  storage: multerS3({
    acl: 'public-read',
    s3,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: `${process.env.BUCKET}`,
    cacheControl: 'max-age=31536000',
    metadata: (_req: any, file: any, cb: any) => {
      console.log(_req,"_req")
      cb(null, { fieldName: file.fieldname });
    },
    key: (_req: any, file: any, cb: any) => {
      console.log(_req,"_req")
      const fileSubsets = file.originalname.split('.');
      let folderName = _req.body.folderName;
      if (Array.isArray(folderName)) {
        folderName = folderName[0];
      }
      cb(
        null,
        `${folderName}/${v4.apply(file.originalname)}.${
          fileSubsets[fileSubsets.length - 1]
        }`
      );
    },
  }),
}).any();

export const uploadCategoryImages = multer({
  fileFilter: imageFilter,
  // storage
  storage: multerS3({
    acl: 'public-read',
    s3,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: `${process.env.BUCKET}`,
    cacheControl: 'max-age=31536000',
    metadata: (_req: any, file: any, cb: any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (_req: any, file: any, cb: any) => {
      const fileSubsets = file.originalname.split('.');
      let folderName = _req.body.folderName;
      if (Array.isArray(folderName)) {
        folderName = folderName[0];
      }
      cb(
        null,
        `${folderName}/${v4.apply(file.originalname)}.${
          fileSubsets[fileSubsets.length - 1]
        }`
      );
    },
  }),
}).any();

export const uploadKycDocs = multer({
  fileFilter: imageFilter,
  // storage
  storage: multerS3({
    acl: 'public-read',
    s3,

    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: `${process.env.BUCKET}`,
    cacheControl: 'max-age=31536000',
    metadata: (_req: any, file: any, cb: any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (_req: any, file: any, cb: any) => {
      const fileSubsets = file.originalname.split('.');
      cb(
        null,
        `${process.env.KYC_DIR}/${v4.apply(file.originalname)}.${
          fileSubsets[fileSubsets.length - 1]
        }`
      );
    },
  }),
}).any();

// CSV Configuration

const csvFilter = (_req: any, file: any, cb: any) => {
  if (!file.originalname.match(/\.(csv)$/)) {
    return cb(new Error('Only CSV files are allowed!'), false);
  }
  cb(null, true);
};

export const uploadCSV = multer({
  fileFilter: csvFilter,
  // storage
  storage: multerS3({
    acl: 'public-read',
    s3,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: `${process.env.BUCKET}`,
    cacheControl: 'max-age=31536000',
    metadata: (_req: any, file: any, cb: any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (_req: any, file: any, cb: any) => {
      const fileSubsets = file.originalname.split('.');
      cb(
        null,
        `bulkCsv/${v4.apply(file.originalname)}.${
          fileSubsets[fileSubsets.length - 1]
        }`
      );
    },
  }),
}).any();

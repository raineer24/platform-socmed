import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import fs from 'fs';
import FileType from 'file-type';

import path = require('path');

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtension: validFileExtension[] = ['png', 'jpeg', 'jpeg'];
const validMimeTypes: validMimeType[] = [
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const saveImageToStorage = {
  storage: diskStorage({
    destination: './images',
    filename: (req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};

import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

export const imagePath = {
  dest: './document',
};

export const multerOptions = () => ({
  // enable file size limits
  limits: {
    fileSize: 1024 * 1024 * 4,
  },
  // Check the mimeTypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  // Storage properties
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const uploadPath =
        imagePath.dest + '/' + (req.body.moduleName || 'document');
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      cb(null, generateFilename(file));
    },
  }),
});

function generateFilename(file) {
  return `${Date.now()}${extname(file.originalname)}`;
}

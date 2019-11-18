// tslint:disable-next-line:no-submodule-imports
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { HttpException, HttpStatus } from '@nestjs/common';

import { MulterFile } from './intrefaces/multer-file.interface';
import { config } from '../../config';

export const csvMulterOptions: MulterOptions = {
    limits: { fileSize: config.csv.maxFileSize },
    fileFilter: (req: any, file: MulterFile, cb: (error: Error | null, acceptFile: boolean) => void) => {
        const { originalname, mimetype } = file;

        if (mimetype !== 'text/csv') {
            cb(new HttpException(`File '${originalname}' is not in csv format`, HttpStatus.BAD_REQUEST), false);
        }

        cb(null, true);
    },
};

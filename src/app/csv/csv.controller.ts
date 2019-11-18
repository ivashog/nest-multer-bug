import { Controller, HttpException, HttpStatus, Logger, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiImplicitFile, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { MulterFile } from './intrefaces/multer-file.interface';
import { CsvService } from './csv.service';
import { csvMulterOptions } from './csv-multer-options';
import { config } from '../../config';

@ApiUseTags('Upload data')
@Controller('csv')
export class CsvController {
    private logger = new Logger(CsvController.name);
    constructor(private readonly csvService: CsvService) {}

    @ApiOperation({ title: 'Upload csv files with values data' })
    @ApiImplicitFile({
        name: config.csv.formFieldName,
        description: `You can select from 1 to ${config.csv.maxFilesCount} csv files. `,
        required: true,
    })
    @Post('upload')
    @UseInterceptors(FilesInterceptor(config.csv.formFieldName, config.csv.maxFilesCount, csvMulterOptions))
    uploadCsvFiles(@UploadedFiles() csvFiles: MulterFile[]) {
        if (!csvFiles || !csvFiles.length) {
            throw new HttpException(
                `Files field '${config.csv.formFieldName}' can not be empty`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const { data, errors } = this.csvService.parseCsv(csvFiles);
        if (errors.length) {
            this.logger.warn(`[uploadCsvFiles] - ${errors.length} files has structure errors and can't be parsed!`);
        }
        this.logger.debug(
            `[uploadCsvFiles] - Parsed ${data.length} values from ${csvFiles.length - errors.length} csv files.`,
        );

        return { data, errors };
    }
}

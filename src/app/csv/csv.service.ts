import { Injectable } from '@nestjs/common';

import { config } from '../../config';
import { MulterFile } from './intrefaces/multer-file.interface';
import { ParsedFilename } from './intrefaces/parsed-filename.interface';

@Injectable()
export class CsvService {
    public parseCsv(csvFiles: MulterFile[]) {
        const result = { data: [], errors: [] };
        for (const csv of csvFiles) {
            try {
                const parsedCsv = this.parseOne(csv);
                result.data.push(...parsedCsv);
            } catch (error) {
                result.errors.push({
                    file: csv.originalname,
                    error: error.message,
                    type: 'FILE_STRUCTURE_ERROR',
                });
            }
        }
        return result;
    }

    public parseOne(csv: MulterFile) {
        const { originalname, buffer } = csv;

        const parsedFileName = CsvService.parseFilename(originalname);
        CsvService.validateParsedFilename(parsedFileName);

        const csvData = buffer.toString();
        const [header, ...datasets] = csvData.split('\n').slice(0, -1);
        CsvService.validateCsvByHeader(header);

        const { indicator, year, quarter = null, month = null } = parsedFileName;
        return datasets.reduce((data: any, dataset: string) => {
            let [koatuu, value] = dataset.split(config.csv.delimiter);
            koatuu = koatuu.padStart(10, '0');
            value = value === '' ? null : value;

            return [...data, { value: Number.parseFloat(value), koatuu, indicator, year, quarter, month }];
        }, []);
    }

    private static validateCsvByHeader(scvHeaderRow: string): void {
        if (!scvHeaderRow.includes(config.csv.delimiter)) {
            throw new Error(`csv delimiter is not valid`);
        }

        const [header1, header2] = scvHeaderRow.split(config.csv.delimiter);

        if (header1 !== 'koatuu' || header2 !== 'value') {
            throw new Error(`csv fields is not valid`);
        }
    }

    private static validateParsedFilename(parsedFilename: ParsedFilename) {
        const { indicator, year, quarter, month } = parsedFilename;
        if (!indicator || !year) {
            throw new Error(`'indicator' or 'year' can not parsed from filename`);
        } else if (quarter && ![1, 2, 3, 4].includes(quarter)) {
            throw new Error(`'quarter'=${quarter} parsed from filename is not valid`);
        } else if (
            quarter &&
            month &&
            ((quarter === 1 && ![1, 2, 3].includes(month)) ||
                (quarter === 2 && ![4, 5, 6].includes(month)) ||
                (quarter === 3 && ![7, 8, 9].includes(month)) ||
                (quarter === 4 && ![10, 11, 12].includes(month)))
        ) {
            throw new Error(`'month'=${month} is not correspond to 'quarter'=${quarter}`);
        }
    }

    /**
     * Extract properties from filename:
     * @param filename is name of parsed csv file, must be a string separated by '_' in format:
     *        {indicator_id: number}_{year: number}_{quarter?: number}_{month?: number}_{description: string}.csv
     */
    private static parseFilename(filename: string): ParsedFilename {
        const [indicator, year, quarter, month] = filename.split('_', 4).map(prop => Number.parseInt(prop, 10));

        return { indicator, year, quarter, month };
    }
}

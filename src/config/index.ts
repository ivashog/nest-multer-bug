import { readFileSync } from 'fs';
import { ConnectionOptions } from 'typeorm';
// tslint:disable-next-line:no-submodule-imports
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

const appPackage = readFileSync(`${__dirname}/../../package.json`, {
    encoding: 'utf8',
});
const appData = JSON.parse(appPackage);

type AuthLocation = 'header' | 'body' | 'query';

interface Config {
    appRootPath: string;
    version: string;
    name: string;
    description: string;
    isProduction: boolean;
    // database: ConnectionOptions;
    port: number;
    host: string;
    apiPrefix: string;
    // auth: {
    //     name: string;
    //     location: AuthLocation;
    //     secret: string;
    //     expiration: string;
    // };
    csv: {
        formFieldName: string;
        maxFilesCount: number;
        maxFileSize: number;
        delimiter: string;
    };
}

export const config: Config = {
    appRootPath: `${__dirname}/../app`,
    version: appData.version,
    name: appData.name,
    description: appData.description,
    isProduction: process.env.NODE_ENV === 'production',
    port: Number.parseInt(process.env.APP_PORT, 10),
    host: process.env.APP_HOST,
    apiPrefix: process.env.API_PREFIX,
    // database: {
    //     type: 'postgres',
    //     host: process.env.TYPEORM_HOST,
    //     port: Number.parseInt(process.env.TYPEORM_PORT, 10),
    //     username: process.env.TYPEORM_USERNAME,
    //     password: process.env.TYPEORM_PASSWORD,
    //     database: process.env.TYPEORM_DATABASE,
    //     schema: process.env.TYPEORM_SCHEMA,
    //     synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    //     logging: process.env.TYPEORM_LOGGING as LoggerOptions,
    //     entities: process.env.TYPEORM_ENTITIES.split(','),
    //     migrations: process.env.TYPEORM_MIGRATIONS.split(','),
    // },
    // auth: {
    //     name: process.env.AUTH_NAME,
    //     location: process.env.AUTH_LOCATION as AuthLocation,
    //     secret: process.env.JWT_SECRET,
    //     expiration: process.env.JWT_EXPIRATION,
    // },
    csv: {
        formFieldName: process.env.CSV_FORM_FIELD_NAME,
        maxFilesCount: Number.parseInt(process.env.CSV_MAX_FILES, 10),
        maxFileSize: Number.parseInt(process.env.CSV_MAX_FILE_SIZE, 10),
        delimiter: process.env.CSV_DELIMITER,
    },
};

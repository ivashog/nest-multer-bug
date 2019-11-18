import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { CsvModule } from './csv/csv.module';
import { LoggingInterceptor } from './_common/logging.interceptor';
import { HttpExceptionFilter } from './_common/http-error.filter';

@Module({
    imports: [CsvModule],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}

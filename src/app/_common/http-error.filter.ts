import { ExceptionFilter, HttpException, HttpStatus, ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { multerExceptions } from '@nestjs/platform-express/multer/multer/multer.constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest();
        const response = context.getResponse();

        // const isKnownException = exception instanceof HttpException || exception instanceof

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            statusCode: status,
            path: request.url,
            method: request.method,
            timestamp: new Date().toLocaleString('ru-RU'),
            errors:
                exception instanceof HttpException
                    ? exception.getResponse() || exception.message || null
                    : 'Internal server error',
        };

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            Logger.error(`${request.method} ${request.url}`, exception.stack, 'ExceptionFilter');
        } else {
            Logger.error(`${request.method} ${request.url}`, errorResponse.errors, 'ExceptionFilter');
        }

        response.status(status).json(errorResponse);
    }
}

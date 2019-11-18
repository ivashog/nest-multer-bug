import { INestApplication, INestApplicationContext, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import helmet from 'helmet';

import { config } from '../config';
import { AppModule } from './app.module';

export class AppDispatcher {
    private app: INestApplication;
    private logger = new Logger(AppDispatcher.name);
    // private microservice: INestMicroservice;

    async dispatch(): Promise<void> {
        await this.createServer();
        // this.createMicroservices();
        // await this.startMicroservices();
        return this.startServer();
    }

    async shutdown(): Promise<void> {
        await this.app.close();
    }

    public getContext(): Promise<INestApplicationContext> {
        return NestFactory.createApplicationContext(AppModule);
    }

    private async createServer(): Promise<void> {
        this.app = await NestFactory.create(AppModule);
        // useContainer(this.app.select(AppModule), { fallbackOnErrors: true });
        this.app.setGlobalPrefix(config.apiPrefix);
        this.app.enableCors();

        if (config.isProduction) {
            this.app.use(helmet());
        }
        const options = new DocumentBuilder()
            .setTitle(config.name.toUpperCase())
            .setDescription(config.description)
            .setVersion(config.version)
            .setBasePath(config.apiPrefix)
            // .addBearerAuth(config.auth.name, config.auth.location)
            .setSchemes(config.isProduction ? 'https' : 'http')
            .build();

        const document = SwaggerModule.createDocument(this.app, options);
        SwaggerModule.setup('/swagger', this.app, document);
    }

    // private createMicroservices(): void {
    //     this.microservice = this.app.connectMicroservice(config.microservice);
    // }
    //
    // private startMicroservices(): Promise<void> {
    //     return this.app.startAllMicroservicesAsync();
    // }

    private async startServer(): Promise<void> {
        await this.app.listen(config.port, config.host);
        this.logger.log(`Swagger is exposed at http://${config.host}:${config.port}/swagger`);
        this.logger.log(`Server is listening http://${config.host}:${config.port}`);

        // process.on('unhandledRejection', err => {
        //     this.logger.error(`[unhandledRejection] ${err}`);
        //     console.error(err);
        // });
    }
}

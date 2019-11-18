import * as exitHook from 'async-exit-hook';
import { Logger } from '@nestjs/common';

import { AppDispatcher } from './app';

const logger = new Logger('Index');

logger.log(`Start`);

const dispatcher = new AppDispatcher();
dispatcher
    .dispatch()
    .then(() => logger.log('Everything up'))
    .catch(e => {
        logger.error(e.message, e.stack);
        process.exit(1);
    });

exitHook(callback => {
    dispatcher.shutdown().then(() => {
        logger.log('Graceful shutdown the server');
        callback();
    });
});

import winston from "winston";

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({
                    all: true,
                    colors: {info: 'blue', warn: 'yellow', error: 'red'}
                }),
                winston.format.simple()
            )
        }),
    ],
    exitOnError: false,
});

logger.stream = {
    write: function(message) {
        logger.info(message);
    }
};

const loggingOfMethodUsed = (level, methodName, attributes, errorMessage) => {
    switch(level) {
        case 'info':
            logger.info(`Method ${methodName} Arguments: ${attributes}`);
            break;
        case 'error':
            logger.error(`Error in the method ${methodName} Arguments: ${attributes} Error message: ${errorMessage}`);
            break;
    }
};

export {logger, loggingOfMethodUsed};
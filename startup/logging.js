const winston = require('winston');
require('express-async-errors');

module.exports = function(){
    process.on('uncaughtException', (ex) => {
        console.log('WE GOT AN UNCAUGHT EXCEPTION');
        winston.error(ex.message, ex);
    });
    
    winston.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));

    winston.add(new winston.transports.File({filename: 'logfile.log'}));
}
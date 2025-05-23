require('dotenv').config();
const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 4000;
const server = app.listen(port, ()=>{
    winston.info(`Server is running on http://localhost:${port}`);
});

module.exports = server;
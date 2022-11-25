'use strict';

require('dotenv').config();
const path = require('path');
global.appRoot = path.resolve(__dirname);
const config = require('./configs');
const { createLogger } = require("./utils/logger");
const logger = createLogger("web");
const systemLogger = createLogger('system');

const express = require("express");
const { createServer } = require("http");


const app = express();
const httpServer = createServer(app);
httpServer.listen(config.httpPort);

const { initWebSocket } = require("./echo/websocket");
initWebSocket(httpServer);

const routes = require("./routes");


app.use(express.json());
app.use('/', routes);



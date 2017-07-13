"use strict";

const port = 3001;
require('app-module-path').addPath(__dirname);
const fs = require('fs');
const path = require('path');
const compression = require('compression');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const exphbs  = require('express-handlebars');
const childProcess = require('child_process');

// middlewares
const md = require('middleware');

// -----------------------------------------------------------------------------
// Server
const app = express();

// GZip
app.use(compression());

// Common middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

// Cross-origin middleware
app.use(md.crossOrigin());

// handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// serve static dirs
app.use('/static', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/vr', express.static(path.join(__dirname, 'node_modules', 'vrview')));

// -----------------------------------------------------------------------------
// Routing

/**
 * Includes endpoints:  ./routes/*.js files
 * @param app
 */
fs.readdirSync(__dirname + '/routes/').forEach(function (file) {
    let name = file.substr(0, file.indexOf('.'));
    require('./routes/' + name)(app);
});

// -----------------------------------------------------------------------------
// Start server

app.listen(port, '127.0.0.1');
console.log('API server started @:' + port);

// -----------------------------------------------------------------------------
// Start socket server

const socketServer = childProcess.fork('./socket-server');

// kill child process on exit
process.on('exit', function() {
  socketServer.kill();
});
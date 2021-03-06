var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var stylus = require('stylus');

var routes = require('./routes/index');
var users = require('./routes/users');

var app;
var server;

module.exports.start = function (port, callback) {
    app = express();

    // view engine setup
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'jade');

    app.use(favicon(path.join(__dirname, '../public/favicon.png')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(stylus.middleware(path.join(__dirname, '../public')));
    app.use(express.static(path.join(__dirname, '../public')));

    app.use('/', routes);
    app.use('/users', users);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    } else {
      app.use(function (err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
              message: err.message,
              error: {}
          });
      });
    }

    app.set('port', normalizePort(port));
    server = http.createServer(app);

    server.on('listening', callback);
    server.on('error', function (error) {
        if (error.syscall !== 'listen') {
            callback(error);
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                callback(error);
                break;
            case 'EADDRINUSE':
                callback(error);
                break;
            default:
                callback(error);
        }
    });

    server.listen(port);
};

module.exports.getExpress = function () {
    return app;
};

module.exports.getServer = function () {
    return server;
};

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

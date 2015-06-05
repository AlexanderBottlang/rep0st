var debug = require('debug')('rep0st:debug');

var fs = require('fs');
var _ = require('underscore');

var analyze = require('./analyze.js');
var download = require('./download.js');
var database = require('./database.js');
var webapp = require('./webapp.js');

module.exports = function () {
    webapp.start(process.env.PORT || '3000', function (err) {
        if (err) throw err;
        var addr = webapp.getServer().address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('webapp listening on ' + bind);
    });
    /*
    database.openDatabase("192.168.1.10", "rep0st", "vagrant", "vagrant", function (err) {
        if (err) throw err;
        debug("opened database");
        database.getLastPostId(function (id) {
            download.updateIndex(id, function (err) {
                if (err) throw err;
                debug("done updating index");
                download.checkForImages(function (err) {
                    if (err) throw err;
                    debug("downloaded images");
                })
            });
        });
    });
    */
};

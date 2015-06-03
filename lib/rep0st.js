var fs = require('fs');
var _ = require('underscore');

var analyze = require('./analyze.js');
var download = require('./download.js');
var database = require('./database.js');

module.exports = function () {
    database.openDatabase("192.168.1.10", "rep0st", "vagrant", "vagrant", function (err) {
        if (err) throw err;
        console.log("opened database");
        database.getLastPostId(function(id) {
            console.log(id);
            download.updateIndex(id, function(err) {
                if (err) throw err;
                console.log("done");
                download.checkForImages(function(err) {
                    if (err) throw err;
                    console.log("downloaded!");
                })
            });
        });
    });
};

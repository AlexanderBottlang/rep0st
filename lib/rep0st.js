var fs = require('fs');
var _ = require('underscore');

var analyze = require('./analyze.js');
var download = require('./download.js');

module.exports = function () {
    download.updateIndex();
    fs.readFile("data/cat.jpg", function (err, data) {
        if (err) throw err;
        analyze.analyze(data, function (err, hashes) {
            _.each(hashes, function (value, key) {
                console.log(key + ": " + value.toString(16));
            });
        });
    });
};

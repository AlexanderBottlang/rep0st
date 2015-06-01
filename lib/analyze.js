var async = require('async');
var _ = require('underscore');

var hashalgorithms = [
    require('./algorithms/ahash.js'),
    require('./algorithms/dhash.js'),
    require('./algorithms/phash.js')
];

module.exports.analyze = function (image, callback) {
    var functions = {};
    _.each(hashalgorithms, function (algo) {
        functions[algo.name] = function (callback) {
            algo.calculate(image, callback);
        };
    });
    async.parallel(functions, function (err, results) {
        callback(err, results);
    });
};

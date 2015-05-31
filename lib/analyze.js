var sharp = require('sharp');
var Long = require('long');

var ahash = require('./ahash.js');
var dhash = require('./dhash.js');
var util = require('./util.js');

module.exports.analyze = function(image) {
  ahash.calculate(image, function(err, hash) {
    if (err) throw err;
    console.log("ahash: " + hash.toString(16));
  });
  dhash.calculate(image, function(err, hash) {
    if (err) throw err;
    console.log("dhash: " + hash.toString(16));
  });
}

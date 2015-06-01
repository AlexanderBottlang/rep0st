var sharp = require('sharp');
var Long = require('long');
var util = require('./../util.js');

module.exports.name = "ahash";

module.exports.calculate = function (image, cb) {
    sharp(image)
        .resize(8, 8)
        .grayscale()
        .raw()
        .toBuffer(function (err, data) {
            if (err) cb(err, null);

            var avgcolor = util.avg(data);
            var hash = new Long(0, 0, true);
            for (var i = 0; i < data.length; i++) {
                if (i > 0) {
                    hash = hash.shiftLeft(1);
                }
                if (data[i] < avgcolor) {
                    hash = hash.or(0);
                } else {
                    hash = hash.or(1);
                }
            }
            cb(null, hash);
        });
};

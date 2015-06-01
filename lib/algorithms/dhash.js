var sharp = require('sharp');
var Long = require('long');
var util = require('./../util.js');

module.exports.name = "dhash";

module.exports.calculate = function (image, cb) {
    sharp(image)
        .resize(9, 8)
        .grayscale()
        .raw()
        .toBuffer(function (err, data) {
            if (err) throw cb(err, null);

            var hash = new Long(0, 0, true);
            for (var i = 0; i < data.length - 1; i++) {
                if (i > 0) {
                    hash = hash.shiftLeft(1);
                }
                var p1 = data[i];
                var p2 = data[i + 1];
                if (p1 < p2) {
                    hash = hash.or(1);
                } else {
                    hash = hash.or(0);
                }
            }

            cb(null, hash);
        });
};

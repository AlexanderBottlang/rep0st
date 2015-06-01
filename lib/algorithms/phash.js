var sharp = require('sharp');
var Long = require('long');
var util = require('./../util.js');

module.exports.name = "phash";

module.exports.calculate = function (image, cb) {
    sharp(image)
        .resize(32, 32)
        .grayscale()
        .raw()
        .toBuffer(function (err, data) {
            if (err) cb(err, null);
            dctdata = util.to2DArray(32, data);

            var total = 0;

            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 8; y++) {
                    total += dctdata[x][y];
                }
            }
            total -= dctdata[0][0];

            var avg = total / (8 * 8) - 1;

            var hash = new Long(0, 0, true);
            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 8; y++) {
                    if (x != 0 && y != 0) {
                        hash = hash.shiftLeft(1);
                        if (dctdata[x][y] > avg) {
                            hash = hash.or(1);
                        } else {
                            hash = hash.or(0);
                        }
                    }
                }
            }
            cb(null, hash);
        });
};

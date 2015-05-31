var fs = require('fs');

var analyze = require('./analyze.js');

module.exports = function() {
  fs.readFile("test.png", function(err, data) {
    if (err) throw err;
    analyze.analyze(data);
  });
}

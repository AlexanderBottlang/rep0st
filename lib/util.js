var Long = require('long');

module.exports.avg = function(array) {
  var sum = 0;
  for (var i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return Math.floor(sum / array.length);
}

module.exports.hammingDistance = function(long1, long2) {
  var dist = 0;
  var val = long1.xor(long2);
  while (val.notEquals(Long.UZERO)) {
    ++dist;
    val = val.and(val.subtract(Long.UONE));
  }
  return dist;
}

var c;

module.exports.dct = function(f) {
  if (!c) {
    c = [];
    for (var i = 1; i < 32; i++) {
      c[i] = 1;
    }
    c[0] = 1 / Math.sqrt(2.0);
  }

  var N = 32;

  var F = create2DArray(N, N);
  for (var u = 0; u < N; u++) {
    for (var v = 0; v < N; v++) {
      var sum = 0.0;
      for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
          sum += Math.cos(((2 * i + 1) / (2.0 * N)) * u * Math.PI) * Math.cos(((2 * j + 1) / (2.0 * N)) * v * Math.PI) * (f[i][j]);
        }
      }
      sum *= ((c[u] * c[v]) / 4.0);
      F[u][v] = sum;
    }
  }
  return F;
}

function create2DArray(rows, columns) {
   var x = new Array(rows);
   for (var i = 0; i < rows; i++) {
       x[i] = new Array(columns);
   }
   return x;
}

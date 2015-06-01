var request = require('request');
var async = require('async');
var _ = require('underscore');

var apiUrl = "http://pr0gramm.com/api/items/get?flags=7";

module.exports.updateIndex = function (downloadDone) {
    var atEnd = false;
    var start = null;
    async.whilst(
        function () {
            return !atEnd && start != 1
        },
        function (callback) {
            var url = apiUrl;
            if (start) {
                url += "&older=" + start
            }

            console.log("requesting api: " + url);

            request.get({url: url, json: true}, function (error, response, body) {
                if (error) {
                    downloadDone(err, null);
                } else if (response.statusCode == 200) {
                    atEnd = body.atEnd;
                    _.each(body['items'], function (post) {
                        if (!start || post.id < start) start = post.id;
                        savePost(post);
                    });
                    callback();
                }
            });
        },
        function (err) {
            callback(err);
        }
    );
};

function savePost(post) {
    console.log(JSON.stringify(post));
}
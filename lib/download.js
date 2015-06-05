var debug = require('debug')('rep0st:debug');

var request = require('request');
var async = require('async');
var through = require('through');
var fs = require('fs-extra');
var path = require('path');
var _ = require('underscore');

var database = require('./database.js');

var imagefolder = "data/images/";
var imageUrl = "http://img.pr0gramm.com/";
var apiUrl = "http://pr0gramm.com/api/items/get?flags=7";

var maxtasks = 10;

module.exports.updateIndex = function (start, downloadDone) {
    var atStart = false;
    if (!start) {
        start = 0;
    }
    async.whilst(
        function () {
            return !atStart;
        },
        function (callback) {
            var url = apiUrl;
            url += "&newer=" + start;

            debug("requesting api: " + url);

            request.get({url: url, json: true}, function (error, response, body) {
                if (error) {
                    downloadDone(err);
                } else if (response.statusCode == 200) {
                    atStart = body.atStart;
                    _.each(body['items'], function (post) {
                        if (post.id > start) start = post.id;
                        savePost(post);
                    });
                    callback();
                }
            });
        },
        function (err) {
            downloadDone(err);
        }
    );
};

module.exports.checkForImages = function (downloadDone) {
    fs.mkdirs(imagefolder, function (err) {
            if (err) downloadDone(err);
            var runningtaskcount = 0;
            var waitingtasks = [];
            var stream = through(function (post) {
                if (runningtaskcount >= maxtasks)
                    this.pause();
                waitingtasks.push(function (callback) {
                    var url = post.imageurl;
                    if (post.fullurl) url = post.fullurl;
                    debug("downloading " + post.id);
                    var image = request(imageUrl + url);
                    image.on('end', function () {
                        callback();
                    });
                    image.pipe(fs.createWriteStream(imagefolder + post.id + path.extname(url)));
                });
                checkWaitingTasks();
            }, function end() {
                downloadDone(null);
            });

            var checkWaitingTasks = function () {
                while (runningtaskcount <= maxtasks && waitingtasks.length != 0) {
                    runningtaskcount++;
                    var task = waitingtasks.pop();
                    task(function () {
                        runningtaskcount--;
                        if (runningtaskcount < maxtasks) {
                            stream.resume();
                        }
                    });
                }
            };

            database.getPosts(stream);
        }
    )
    ;
}
;

function savePost(post) {
    database.addPost({
        id: post.id,
        created: post.created,
        imageurl: post.image,
        thumburl: post.thumb,
        fullurl: post.fullsize === "" ? undefined : post.fullsize,
        flags: post.flags,
        uploader: post.user
    });
}
var async = require('async');
var _ = require('underscore');
var Knex = require('knex');

var enableLogging = false;
var deleteTablesOnRestart = false;

var knex;

module.exports.getKnex = function (donecb) {
    return knex;
};

module.exports.openDatabase = function (dbhostname, dbname, dbuser, dbpassword, donecb) {
    knex = new Knex({
        client: 'pg',
        connection: {
            host: dbhostname,
            user: dbuser,
            password: dbpassword,
            database: dbname
        },
        pool: {
            min: 0,
            max: 5
        },
        debug: enableLogging
    });
    console.log("here");
    createTables(donecb);
};

module.exports.addPost = function (post, donecb) {
    knex('post').insert(post).then(donecb);
};

module.exports.getPosts = function (stream) {
    knex.select('*').from('post').orderBy('id', 'asc').pipe(stream);
};

module.exports.getLastPostId = function (donecb) {
    knex('post').max('id').then(function (val) {
        donecb(val[0].max);
    });
};

function createTables(donecb) {
    var tables = {};

    tables.post = function (table) {
        table.integer('id').primary();
        table.integer('created');
        table.string('imageurl');
        table.string('thumburl');
        table.string('fullurl');
        table.integer('flags');
        table.string('uploader');
    };
    tables.ahash = function (table) {
        table.integer('id').primary().references('id').inTable('post');
        table.bigInteger('hash');
    };
    tables.dhash = function (table) {
        table.integer('id').primary().references('id').inTable('post');
        table.bigInteger('hash');
    };
    tables.phash = function (table) {
        table.integer('id').primary().references('id').inTable('post');
        table.bigInteger('hash');
    };

    var tasks = [];
    _.each(tables, function (fn, tablename) {
        tasks.push(function (callback) {
            console.log(tablename);
            if (deleteTablesOnRestart) {
                knex.schema.dropTableIfExists(tablename);
            }
            knex.schema.hasTable('post').then(function (exists) {
                if (!exists) {
                    knex.schema.createTable(tablename, function (table) {
                        fn(table);
                    });
                }
                callback();
            }).catch(function (err) {
                callback(err);
            });
        })
    });
    async.series(tasks, function (err) {
        donecb(err);
    });
}

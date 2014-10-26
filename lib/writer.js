/**
 * Writer Class
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var UnkownError = require('./error/unknown');
var WriteError = require('./error/write');
var File = require('./file');

var Iconv = require('iconv').Iconv;
var extend = require('extend');
var mime = require('mime');
var async = require('async');

/**
 * @constructor
 *
 * @param {Object} [options] - Options object
 *  {
 *      clear: true,
 *      version: 1|2|"both", // Default "both"
 *      encoding: {
 *          from: "UTF-8",
 *          to: "ISO-8859-1"
 *      }
 *  }
 * @throws {ReferenceError} Errors while validate options
 */
var Writer = function(options)
{
    this.setOptions(options || {});
};

/**
 * Set options.
 *
 * @param {Object} options - Options object
 *  {
 *      clear: true,
 *      version: 1|2|"both", // Default "both"
 *      encoding: {
 *          from: "UTF-8",
 *          to: "ISO-8859-1"
 *      }
 *  }
 * @return {Writer} Provide fluent interface
 * @throws {ReferenceError} Errors while validate options
 */
Writer.prototype.setOptions = function(options)
{
    var defaultOptions = {
        clear: true,
        version: 'both',
        encoding: {
            from: 'UTF-8',
            to: 'UTF-8'
        }
    };

    this.options = extend(true, {}, defaultOptions, options || {});

    // Validate options
    if (!~[1, 2, 'both'].indexOf(this.options.version)) {
        throw new ReferenceError('Invalid version given ' + this.options.version);
    }

    try {

        this.transcode = new Iconv(
            this.options.encoding.from,
            this.options.encoding.to
        );

    } catch (e) {
        throw new ReferenceError('Invalid encoding settings - ' + e.message);
    }

    return this;
};

/**
 * Set file.
 *
 * @param {File} file - File object
 * @return {Writer} Provide fluent interface
 * @throws {TypeError} Errors while passing invalid file objects
 * @throws {ReferenceError} Errors while validate file
 */
Writer.prototype.setFile = function(file)
{
    // Check for a valid File instance
    if (!(file instanceof File)) {
        throw new TypeError('Given object is not a File instance');
    }

    // Check for a filled File instance
    if (null === file.getPath()) {
        throw new ReferenceError('Given File instance got no path set');
    }

    // Check if the given file type is MP3
    if (!~['audio/mpeg'].indexOf(mime.lookup(file.getPath()))) {
        throw new FileError('Given file "%s" is not a MP3 file', path);
    }

    this.file = file;

    return this;
};

/**
 * Configure all write adapters.
 *
 * @param {Function} callback - Function to call on finish
 */
Writer.prototype.configure = function(callback)
{
    var self = this;

    var adapterOptions = {
        transcode: this.transcode.convert,
        encoding: this.options.encoding.to
    };

    var adapters = [
        (new (require('./writer/id3tag'))(adapterOptions)),
        (new (require('./writer/eyeD3'))(adapterOptions))
    ];

    async.map(adapters, function(adapter, callback) {

        adapter.configure(function(err) {

            if (err) {
                return callback && callback(err);
            }

            adapter.checkDependencies(adapter.methods, function(err, map) {

                if (err) {
                    return callback && callback(err);
                }

                callback && callback(null, {
                    name: adapter.name,
                    methods: map,
                    adapter: adapter
                });
            });
        });

    }, function(err, results) {

        if (err) {
            return callback && callback(err);
        }

        self.adapters = {};

        results.forEach(function(item) {

            var available = false;

            Object.keys(item.methods).forEach(function(name) {

                var method = item.methods[name];

                if (true === method) {
                    item.adapter.availableMethods.push(name);
                    available = true;
                }
            });

            if (true === available) {
                self.adapters[item.name] = item.adapter;
            }
        });

        // Check if we got any available adapters
        if (0 === Object.keys(self.adapters).length) {
            return callback && callback(
                new Error('No available write adapters found')
            );
        }

        callback && callback();
    });
};

/**
 * Get adapter for method.
 *
 * @param {String} method - Method for we need a adapter
 * @return {Object} Adapter to use
 */
Writer.prototype.getAdapterForMethod = function(method)
{
    var self = this;
    var adapter = null;

    Object.keys(this.adapters).some(function(name) {

        var cur = self.adapters[name];

        if (~cur.availableMethods.indexOf('clear')) {
            adapter = cur;
            return true;
        }
    });

    return adapter;
};

/**
 * Write meta information to the assigned file.
 *
 * @param {Meta} meta - Meta information object
 * @param {Function} callback - Function to call on finish
 */
Writer.prototype.write = function(meta, callback)
{
    var self = this;
    var queue = [];

    // The writer was not configured yet - do it the first time
    if (!this.adapters) {
        queue.push(self.configure.bind(self));
    }

    // @COMPATIBILITY: Move song to title, if title is not present
    if (meta.information.song && !meta.information.title) {
        meta.information.title = meta.information.song;
    }

    // Append the cleaner if needed
    if (true === this.options.clear) {

        queue.push(function(callback) {

            var adapter = self.getAdapterForMethod('clear');

            if (!adapter) {
                return callback && callback(
                    new Error('No available write adapter to clear tags')
                );
            }

            adapter.clear(self.file, self.options.version, function(err) {
                callback && callback(err);
            });
        });
    }

    // Append the writer
    queue.push(function(callback) {

        var adapter = self.getAdapterForMethod('write');

        // We should write images to
        if ((meta.images && 0 !== meta.images.length) ||
            'UTF-8' === self.options.encoding.to) {

            if (!self.adapters.eyeD3) {
                return callback && callback(
                    new Error('No available write adapter to write images')
                );
            }

            adapter = self.adapters.eyeD3;
        }

        if (!adapter) {
            return callback && callback(
                new Error('No available write adapter to clear tags')
            );
        }

        adapter.write(
            self.file, self.options.version, meta, function(err) {
                callback && callback(err);
            }
        );
    });

    async.waterfall(queue, function(err) {
        callback && callback(err);
    });
};

module.exports = Writer;


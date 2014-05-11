/**
 * Abstract Write Adapter
 */

var async = require('async');
var exec = require('child_process').exec;

var File = require('../file');
var Meta = require('../meta');

/**
 * @constructor
 *
 * @param {Object} options - Options object
 */
var Writer = function(options)
{
    this.name = 'abstract';
    this.availableMethods = [];
    this.options = options || {
        transcode: function(str) {
            return str;
        },
        encoding: 'ISO-8859-1'
    };
};

/**
 * Configure the write adapter.
 *
 * @param {Function} callback - Function to call on finish
 */
Writer.prototype.configure = function(callback)
{
    callback && callback();
};

/**
 * Check given version.
 *
 * @param {Number|String} version - Only strip tags of given version - Default "both"
 * @return {Writer} Provide fluent interface
 * @throws {ReferenceError} Errors while validate version
 */
Writer.prototype.checkVersion = function(version)
{
    if (version && !~[1, 2, 'both'].indexOf(version)) {
        throw new ReferenceError('Invalid version given');
    }

    return this;
};

/**
 * Check given file object.
 *
 * @param {File} file - File object
 * @return {Writer} Provide fluent interface
 * @throws {TypeError|ReferenceError} Errors while validate file object
 */
Writer.prototype.checkFile = function(file)
{
    // Check for a valid File instance
    if (!(file instanceof File)) {
        throw new TypeError('Given object is not a File instance');
    }

    // Check for a filled File instance
    if (null === file.getPath()) {
        throw new ReferenceError('Given File instance got no path set');
    }

    return this;
};

/**
 * Check given meta object.
 *
 * @param {Meta} meta - Meta object to write
 * @return {Writer} Provide fluent interface
 * @throws {TypeError} Errors while validate meta object
 */
Writer.prototype.checkMeta = function(meta)
{
    // Check for a valid File instance
    if (!(meta instanceof Meta)) {
        throw new TypeError('Given object is not a Meta instance');
    }

    return this;
};

/**
 * Check system dependencies.
 *
 * @param {Object} methods - Methods-command map to check
 * @param {Function} callback - Function to call on finish
 */
Writer.prototype.checkDependencies = function(methods, callback)
{
    async.map(Object.keys(methods), function(method, callback) {

        var command = methods[method];

        exec('which ' + command, function(err, stdout, stderr) {

            var available = true;

            if (err || stderr) {
                available = false;
            }

            callback && callback(null, {
                method: method,
                command: command,
                available: available
            });
        });

    }, function(err, results) {

        if (err) {
            return callback && callback(err);
        }

        var map = {};
        results.forEach(function(item) {
            map[item.method] = item.available;
        });

        callback && callback(null, map);
    });
};

/**
 * Execute the given command.
 *
 * @param {String} command - Command to execute
 * @param {Function} callback - Function to call on finish
 */
Writer.prototype.exec = function(command, callback)
{
    exec('env ' + command, function(err, stdout, stderr) {

        if (err || stderr) {

            if (err) {
                console.log(command + '\n');
                console.error(err.stack);
            }

            return callback && callback(err);
        }

        callback && callback();
    });
};

/**
 * Clear all tags of a file.
 *
 * @param {File} file - File object
 * @param {Number|String} version - Only strip tags of given version
 * @param {Function} callback - Function to call on finish
 * @throws {ReferenceError} Errors while validate version
 */
Writer.prototype.clear = function(file, version, callback)
{
    this.checkVersion(version)
        .checkFile(file);

    callback && callback();
};

/**
 * Write all given tags to the file.
 *
 * @param {File} file - File object to write to
 * @param {Number|String} version - Only strip tags of given version
 * @param {Meta} meta - Meta object to write
 * @param {Function} callback - Function to call on finish
 * @throws {ReferenceError} Errors while validate version
 */
Writer.prototype.write = function(file, version, meta, callback)
{
    this.checkVersion(version)
        .checkFile(file)
        .checkMeta(meta);

    callback && callback();
};

module.exports = Writer;


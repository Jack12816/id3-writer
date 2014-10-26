/**
 * id3tag Write Adapter
 */

var util = require('util');
var AbstractWriter = require('./abstract');

/**
 * @constructor
 *
 * @param {Object} options - Options object
 */
var Writer = function(options)
{
    // Call abstract constructor
    AbstractWriter.prototype.constructor.apply(this, arguments);

    this.name = 'id3tag';
    this.methods = {
        clear: 'id3convert',
        write: 'id3tag'
    };
};

/**
 * Extend from the abstract writer.
 */
util.inherits(Writer, AbstractWriter);

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

    var args = ['-s'];
    var commandTemplate = '%s %s "%s"';

    switch (version) {
        case 'both':
            args.push('-1');
            args.push('-2');
            break;
        case 1:
            args.push('-1');
            break;
        case 2:
            args.push('-2');
            break;
    }

    var command = util.format(
        commandTemplate,
        this.methods.clear,
        args.join(' '),
        file.getPath()
    );

    this.exec(command, callback)
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

    var args = [];
    var commandTemplate = '%s %s "%s"';

    switch (version) {
        case 'both':
            args.push('-1');
            args.push('-2');
            break;
        case 1:
            args.push('-1');
            break;
        case 2:
            args.push('-2');
            break;
    }

    var self = this;

    Object.keys(meta.information).forEach(function(key) {

        var value = meta.information[key];

        // Skip value less tags
        if ('' === value || 0 === value) {
            return;
        }

        // Transcode strings
        if ('string' === typeof value) {
            value = self.options.transcode(value);
        }

        switch (key) {
            case 'artist':
                args.push('-a "' + value + '"');
                break;
            case 'title':
                args.push('-s "' + value + '"');
                break;
            case 'album':
                args.push('-A "' + value + '"');
                break;
            case 'comment':
                args.push('-c "' + value + '"');
                break;
            case 'desc':
                args.push('-C "' + value + '"');
                break;
            case 'genre':
                args.push('-g ' + value);
                break;
            case 'year':
                args.push('-y ' + value);
                break;
            case 'track':
                args.push('-t ' + value);
                break;
            case 'total':
                args.push('-T ' + value);
                break;
        }
    });

    var command = util.format(
        commandTemplate,
        this.methods.write,
        args.join(' '),
        file.getPath()
    );

    this.exec(command, callback);
};

module.exports = Writer;


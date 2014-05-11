/**
 * eyeD3 Write Adapter
 */

var util = require('util');
var AbstractWriter = require('./abstract');

/**
 * @constructor
 */
var Writer = function()
{
    // Call abstract constructor
    AbstractWriter.prototype.constructor.apply(this, arguments);

    this.name = 'eyeD3';
    this.methods = {
        clear: 'eyeD3',
        write: 'eyeD3'
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

    var args = ['--remove-all-images'];
    var commandTemplate = '%s %s %s';

    switch (version) {
        case 'both':
            args.push('--remove-all');
            break;
        case 1:
            args.push('--remove-v1');
            break;
        case 2:
            args.push('--remove-v2');
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
    var commandTemplate = '%s %s %s';

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

    Object.keys(meta.information).forEach(function(key) {

        var value = meta.information[key];

        // Skip value less tags
        if ('' === value || 0 === value) {
            return;
        }

        switch (key) {
            case 'artist':
                args.push('-a "' + value + '"');
                break;
            case 'song':
                args.push('-t "' + value + '"');
                break;
            case 'album':
                args.push('-A "' + value + '"');
                break;
            case 'comment':
                args.push('-C "' + value + '"');
                break;
            case 'desc':
                args.push('-C "' + value + '"');
                break;
            case 'genre':
                args.push('-G ' + value);
                break;
            case 'year':
                args.push('-Y ' + value);
                break;
            case 'track':
                args.push('-n ' + value);
                break;
            case 'total':
                args.push('-N ' + value);
                break;
        }
    });

    if (meta.images && 0 !== meta.images.length) {

        meta.images.forEach(function(image) {

            var arg = '--add-image %s:%s%s';

            args.push(util.format(
                arg,
                image.getFile().getPath(),
                image.getType(),
                (image.getDescription())
                    ? (':"' + image.getDescription() + '"')
                    : ''
            ));
        });
    }

    var command = util.format(
        commandTemplate,
        this.methods.write,
        args.join(' '),
        file.getPath()
    );

    this.exec(command, callback)
};

module.exports = Writer;


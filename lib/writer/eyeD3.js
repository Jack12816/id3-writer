/**
 * eyeD3 Write Adapter
 */

var util = require('util');
var exec = require('child_process').exec;
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

    this.name = 'eyeD3';
    this.methods = {
        clear: 'eyeD3',
        write: 'eyeD3'
    };

    if (~this.options.encoding.indexOf('ISO-')) {
        this.options.encoding = 'latin1';
    }

    if ('UTF-8' === this.options.encoding) {
        this.options.encoding = 'utf8';
    }

    if ('UTF-16' === this.options.encoding) {
        this.options.encoding = 'utf16';
    }

    this.version = null;
};

/**
 * Extend from the abstract writer.
 */
util.inherits(Writer, AbstractWriter);

/**
 * Configure the write adapter.
 *
 * @param {Function} callback - Function to call on finish
 */
Writer.prototype.configure = function(callback)
{
    var self = this;

    exec('env ' + this.name + ' --version', function(err, stdout, stderr) {

        // We need to skip error handling - eyeD3 exit with
        // code 1 on --version requests - whyever
        // So stderr contains the normal stdout
        stdout = stderr || '';

        if (~stdout.indexOf('0.6.')) {
            self.version = '0.6';
        }

        if (~stdout.indexOf('0.7.')) {
            self.version = '0.7';
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

    var args = [];
    var commandTemplate = '%s %s "%s"';

    if ('0.6' === this.version) {
        args.push('--remove-images');
    }

    if ('0.7' === this.version) {
        args.push('--remove-all-images');
    }

    switch (version) {
        case 'both':
            args = ['--remove-all'];
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
        file.getPath().replace(/"/g, '\\"')
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

    var args = ['--force-update'];
    var commandTemplate = '%s %s "%s"';

    if ('0.6' === this.version) {
        args.push('--set-encoding ' + this.options.encoding)
    }

    if ('0.7' === this.version) {
        args.push('--encoding ' + this.options.encoding);
    }

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
            value = self.options.transcode(value.replace(/"/g, ''));
        }

        switch (key) {
            case 'artist':
                args.push('-a "' + value + '"');
                break;
            case 'title':
                args.push('-t "' + value + '"');
                break;
            case 'album':
                args.push('-A "' + value + '"');
                break;
            case 'genre':
                args.push('-G "' + value + '"');
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

    // We got a comment but no description
    if (meta.information.comment && !meta.information.desc) {
        args.push('-c "' + meta.information.comment + '"');
    }

    // We got no comment but a description, we just set it as a comment
    if (!meta.information.comment && meta.information.desc) {
        args.push('-c "' + meta.information.desc + '"');
    }

    // We got both - a comment with a description
    if (meta.information.comment && meta.information.desc) {
        args.push(
            '--add-comment "' +
            meta.information.comment +
            ':' +
            meta.information.desc +
            '"'
        );
    }

    if (meta.images && 0 !== meta.images.length) {

        meta.images.forEach(function(image) {

            var arg = '--add-image "%s":%s%s';

            args.push(util.format(
                arg,
                image.getFile().getPath().replace(/"/g, '\\"'),
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
        file.getPath().replace(/"/g, '\\"')
    );

    this.exec(command, callback)
};

module.exports = Writer;

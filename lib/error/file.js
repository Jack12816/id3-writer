/**
 * File Error Class
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var util = require('util');

/**
 * @constructor
 *
 * @param {String} message - Message of the error
 */
var FileError = function(message)
{
    if (!message) {
        message = 'UNKNOWN_ERROR'
    }

    if (2 <= arguments.length) {
        message = util.format(message, Array.prototype.slice.call(arguments, 1));
    }

    this.name = 'FileError';
    this.message = message;
};

util.inherits(FileError, Error);

module.exports = FileError;


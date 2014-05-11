/**
 * Write Error Class
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var util = require('util');

/**
 * @constructor
 *
 * @param {String} message - Message of the error
 */
var WriteError = function(message)
{
    if (!message) {
        message = 'UNKNOWN_ERROR'
    }

    if (2 <= arguments.length) {
        message = util.format(message, Array.prototype.slice.call(arguments, 1));
    }

    this.name = 'WriteError';
    this.message = message;
};

util.inherits(WriteError, Error);

module.exports = WriteError;


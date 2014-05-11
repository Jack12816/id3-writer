/**
 * File Class
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var FileError = require('./error/file');

var fs = require('fs');

/**
 * @constructor
 *
 * @param {String} [path] - Path of the file to work on
 * @throws {FileError} Errors while loading the file
 */
var File = function(path)
{
    this.path = null;

    if (path) {
        this.setPath(path);
    }
};

/**
 * Check a given path.
 *
 * @param {String} path - Path to check
 * @throws {FileError} Errors while loading the file
 */
File.prototype.check = function(path, types)
{
    // Check if the given path exists
    if (!fs.existsSync(path)) {
        throw new FileError('Given path "%s" does not exists', path);
    }

    // Check if the given path is a file
    if (!fs.statSync(path).isFile()) {
        throw new FileError('Given path "%s" is not a file', path);
    }
};

/**
 * Check and set the path.
 *
 * @param {String} path - Path to set
 * @throws {FileError} Errors while loading the file
 */
File.prototype.setPath = function(path)
{
    // Check the path
    this.check(path);

    // Assign the path
    this.path = path;
};

/**
 * Get the path.
 *
 * @return {String} path
 */
File.prototype.getPath = function()
{
    return this.path;
};

module.exports = File;


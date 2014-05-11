/**
 * Image Class
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var File = require('./file');

/**
 * @constructor
 *
 * @param {File|String} [file] - Path of the file to work on
 * @throws {FileError} Errors while valdating the file
 */
var Image = function(file)
{
    this.file = null;
    this.type = 'FRONT_COVER';
    this.desc = '';

    if (file) {
        this.setFile(file);
    }
};

/**
 * Set image file.
 *
 * @param {File|String} file - File object to set
 * @return {Image} Provide fluent interface
 * @throws {TypeError} Errors while passing invalid file objects
 */
Image.prototype.setFile = function(file)
{
    // Check for a valid File instance
    if (!(file instanceof File)) {
        file = new File(file);
    }

    this.file = file;
};

/**
 * Get assigned file.
 *
 * @return {File} Assigned file
 */
Image.prototype.getFile = function()
{
    return this.file;
};

/**
 * Set type of the image.
 *
 * @param {String} type - Image type to set
 * @return {Image} Provide fluent interface
 * @throws {ReferenceError} Errors while validate given type
 */
Image.prototype.setType = function(type)
{
    var validTypes = [
        'OTHER', 'ICON', 'OTHER_ICON', 'FRONT_COVER', 'BACK_COVER', 'LEAFLET',
        'MEDIA', 'LEAD_ARTIST', 'ARTIST', 'CONDUCTOR', 'BAND', 'COMPOSER',
        'LYRICIST', 'RECORDING_LOCATION', 'DURING_RECORDING',
        'DURING_PERFORMANCE', 'VIDEO', 'BRIGHT_COLORED_FISH', 'ILLUSTRATION',
        'BAND_LOGO', 'PUBLISHER_LOGO'
    ];

    if (!~validTypes.indexOf(type)) {
        throw new ReferenceError('Image type "' + type + '" is unknown');
    }

    this.type = type;

    return this;
};

/**
 * Get type of the image.
 *
 * @return {String} Type of the image
 */
Image.prototype.getType = function()
{
    return this.type;
};

/**
 * Set description of the image.
 *
 * @param {String} description - Description to set
 * @return {Image} Provide fluent interface
 */
Image.prototype.setDescription = function(description)
{
    this.desc = description;

    return this;
};

/**
 * Get description of the image.
 *
 * @return {String} Description of the image
 */
Image.prototype.getDescription = function()
{
    return this.desc;
};

module.exports = Image;


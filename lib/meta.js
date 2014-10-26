/**
 * Meta Information Class
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var extend = require('extend');
var Image = require('./image');

/**
 * @constructor
 *
 * @param {Object} information - Meta information to set
 *  {
 *      artist: String,
 *      song: String,
 *      album: String,
 *      comment: String,
 *      desc: String,
 *      genre: String,
 *      year: Number,
 *      track: Number,
 *      total: Number
 *  }
 * @param {Array} [images] - Array of Image objects
 */
var Meta = function(information, images)
{
    // Initalize the meta information
    this.information = {};
    this.set(information || {}, true);

    // Initalize images
    this.images = [];
    this.addImages(images || [], true);
};

/**
 * Clear the meta information.
 */
Meta.prototype.clear = function()
{
    this.information = {
        artist: '',
        title: '',
        song: '',
        album: '',
        comment: '',
        desc: '',
        genre: '',
        year: (new Date()).getFullYear(),
        track: 0,
        total: 0
    };
};

/**
 * Validate the meta information.
 *
 * @param {Object} information - Meta information to set
 * @throws {ReferenceError} Error while validating the given keys
 */
Meta.prototype.validate = function(information)
{
    // Validate keys by types
    var numbers = [
        'year', 'track', 'total'
    ];
    var strings = [
        'artist', 'title', 'song', 'album', 'comment',
        'desc', 'genre'
    ];

    var validKeys = [].concat(numbers, strings);
    var givenKeys = Object.keys(information || {});

    {
        // Validate keys
        var unkown = givenKeys.filter(function(key) {
            return !~validKeys.indexOf(key);
        });

        if (0 !== unkown.length) {
            throw new ReferenceError('Unknown keys: ' + unkown.join(', '));
        }
    }

    {
        // Validate types
        var errors = [];

        givenKeys.forEach(function(key) {

            var value = information[key];

            if (~numbers.indexOf(key) &&
                'number' !== typeof value) {
                errors.push(key + ' is not number');
            }

            if (~strings.indexOf(key) &&
                'string' !== typeof value) {
                errors.push(key + ' is not string');
            }
        });

        if (0 !== errors.length) {
            throw new ReferenceError('Bad typed keys: ' + errors.join(', '));
        }
    }
};

/**
 * Set meta information.
 *
 * @param {Object} information - Meta information to set
 * @param {Boolean} [clear] - Clear all other information - Default: false
 * @throws {ReferenceError} Error while validating the given keys
 */
Meta.prototype.set = function(information, clear)
{
    // Check the clear parameter
    if (null === clear || undefined === clear) {
        clear = false;
    }

    // Clear if needed
    if (true === clear) {
        this.clear();
    }

    this.validate(information);

    // Extend the information
    this.information = extend(true, this.information || {}, information);
};

/**
 * Get meta information.
 *
 * @return {Object} Meta information
 */
Meta.prototype.get = function()
{
    return this.information;
};

/**
 * Add images.
 *
 * @param {Array} images - Array of Image objects
 * @param {Boolean} [clear] - Clear all other information - Default: false
 * @throws {TypeError} Error while validating the given images
 */
Meta.prototype.addImages = function(images, clear)
{
    // Clear if needed
    if (true === clear) {
        this.images = [];
    }

    images.forEach(function(image) {

        // Check for a valid Image instance
        if (!(image instanceof Image)) {
            throw new TypeError('Given object is not a Image instance');
        }
    });


    // Extend the information
    this.images = images;
};

/**
 * Get all images.
 *
 * @return {Array} Array of Image objects
 */
Meta.prototype.getImages = function()
{
    return this.images;
};

module.exports = Meta;


/**
 * Image test case
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var should = require('should');
var path = require('path');

var File = require('../lib/file');
var Image = require('../lib/image');

describe('Image', function()
{
    var file = new File(path.join(__dirname, 'fixtures', 'cover.png'));

    it('should work with a file only', function() {

        (function() {
            var image = new Image(file);
        }).should.not.throw();
    });

    it('should work to set image type if known', function() {

        (function() {
            var image = new Image(file);
            image.setType('PUBLISHER_LOGO');
        }).should.not.throw();
    });

    it('should fail to set image type if unknown', function() {

        (function() {
            var image = new Image(file);
            image.setType('UNKNOWN_IMAGE_TYPE_77');
        }).should.throw();
    });

    it('should work to set a description', function() {

        (function() {
            var image = new Image(file);
            image.setDescription('Some image description');
        }).should.not.throw();
    });
});


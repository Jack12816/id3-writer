/**
 * File test case
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var should = require('should');
var path = require('path');
var File = require('../lib/file');

describe('File', function()
{
    var validFilePath = path.join(__dirname, 'fixtures', 'tone.mp3');
    var invalidFilePath = path.join(__dirname, 'fixtures', 'missing.mp3');

    it('should do anything without a path', function() {

        (function() {
            var file = new File();
        }).should.not.throw();
    });

    it('should work for valid file paths on the constructor', function() {

        (function() {
            var file = new File(validFilePath);
            file.path.should.be.equal(validFilePath);
        }).should.not.throw();
    });

    it('should fail for invalid paths on the constructor', function() {

        (function() {
            var file = new File(invalidFilePath);
        }).should.throw();
    });

    it('should work for valid file paths on setPath method', function() {

        (function() {
            var file = new File(validFilePath);
            file.path.should.be.equal(validFilePath);
        }).should.not.throw();
    });

    it('should fail for invalid paths on the setPath method', function() {

        (function() {
            var file = new File();
            file.setPath(invalidFilePath);
        }).should.throw();
    });

    it('should give a valid file path back on getPath method', function() {

        (function() {
            var file = new File(validFilePath);
            file.getPath().should.be.equal(validFilePath);
        }).should.not.throw();
    });
});


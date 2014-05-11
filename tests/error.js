/**
 * Error test case
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var should = require('should');

var UnknownError = require('../lib/error/unknown');
var FileError = require('../lib/error/file');
var WriteError = require('../lib/error/write');

/**
 * Test the formating options of own defined
 * errors.
 *
 * @param {Function} constructor - Constructor of the error class to test
 */
var testFormating = function(constructor)
{
    var obj = new constructor();
    obj.message.should.be.equal('UNKNOWN_ERROR');

    var obj = new constructor('test');
    obj.message.should.be.equal('test');

    var obj = new constructor('%s test');
    obj.message.should.be.equal('%s test');

    var obj = new constructor('%s test', 'test');
    obj.message.should.be.equal('test test');
};

describe('UnknownError', function()
{
    it('should have the correct name', function() {
        var obj = new UnknownError();
        obj.name.should.be.equal('UnknownError');
    });

    it('should format the message', function() {
        testFormating(UnknownError);
    });
});

describe('FileError', function()
{
    it('should have the correct name', function() {
        var obj = new FileError();
        obj.name.should.be.equal('FileError');
    });

    it('should format the message', function() {
        testFormating(FileError);
    });
});

describe('WriteError', function()
{
    it('should have the correct name', function() {
        var obj = new WriteError();
        obj.name.should.be.equal('WriteError');
    });

    it('should format the message', function() {
        testFormating(WriteError);
    });
});


/**
 * Meta test case
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var should = require('should');
var Meta = require('../lib/meta');

describe('Meta', function()
{
    it('should work on known and valid keys on the constructor', function() {

        (function() {
            var meta = new Meta({
                artist: '',
                song: '',
                album: '',
                comment: '',
                desc: '',
                genre: '',
                year: 2014,
                track: 0,
                total: 0
            });
        }).should.not.throw();
    });

    it('should fail on unknown keys on the constructor', function() {

        (function() {
            var meta = new Meta({
                invalid: true,
                missing: [],
                type: Array
            });
        }).should.throw();
    });

    it('should fail on mixed known keys on the constructor', function() {

        (function() {
            var meta = new Meta({
                song: '',
                invalid: true,
            });
        }).should.throw();
    });

    it('should fail on known and invalid typed keys on the constructor', function() {

        (function() {
            var meta = new Meta({
                artist: false,
                song: 0xfff,
                album: {},
                comment: true,
                desc: [],
                genre: 1,
            });
        }).should.throw();
    });

    it('should work to clear and set', function() {

        (function() {

            var meta = new Meta({
                song: '2'
            });

            meta.set({
                album: 'album'
            }, true);

            meta.get().should.be.containDeep({
                artist: '',
                song: '',
                album: 'album',
                comment: '',
                desc: '',
                genre: '',
                year: (new Date()).getFullYear(),
                track: 0,
                total: 0
            });

        }).should.not.throw();
    });
});


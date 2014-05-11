[![ID3 Writer logo](https://raw.githubusercontent.com/Jack12816/id3-writer/master/logo.png)]()

ID3 Writer is a small and tested library for writing ID3 tags to MP3
files. We don't touch the files self - we speak to write adapters like
libid3 or eyeD3. So this library is just a wrapper around the CLI programs.

I don't plan to support Windows explicit. But if someone requests a pull
for a write adapter with Windows support I will not reject it.

[![Build Status](http://img.shields.io/travis/Jack12816/id3-writer.svg)](http://travis-ci.org/Jack12816/id3-writer)
[![Gittip](http://img.shields.io/gittip/Jack12816.png)](https://www.gittip.com/Jack12816/)
[![npm Downloads](http://img.shields.io/npm/dm/id3-writer.svg)](https://www.npmjs.org/package/id3-writer)
[![npm Version](http://img.shields.io/npm/v/id3-writer.svg)](https://www.npmjs.org/package/id3-writer)
[![Dependency Status](https://david-dm.org/jack12816/id3-writer.png)](https://david-dm.org/jack12816/id3-writer)

## Features

* Support for multiple write adapters
    * We check if some binaries are available to do the tasks
* Support for ID3v1 and ID3v2
    * ID3v2 Tags need some validation at this point
* Support for converting the encoding of the given tags
* Support for writing images to the MP3 files (eyeD3 only atm)

## Getting Started

### Installation

    $ npm install id3-writer

## API

### Simply write ID3 tags

```js
// Load and assign modules
var id3 = require('id3-writer');
var writer = new id3.Writer();

var file = new id3.File('/tmp/your.mp3');
var meta = new id3.Meta({
    artist: 'Blur',
    song: 'Song 2',
    album: 'Blur'
});

writer.setFile(file).write(meta, function(err) {

    if (err) {
        // Handle the error
    }

    // Done
});
```

### Write ID3 tags with a additional image

```js
// Load and assign modules
var id3 = require('id3-writer');
var writer = new id3.Writer();

var mp3 = new id3.File('/tmp/your.mp3');
var coverImage = new id3.Image('/tmp/cover.png');

var meta = new id3.Meta({
    artist: 'Blur',
    song: 'Song 2',
    album: 'Blur'
}, [coverImage]);

writer.setFile(file).write(meta, function(err) {

    if (err) {
        // Handle the error
    }

    // Done
});
```

## Running Tests

To run the test suite just run the following command, which installs the
development dependencies:

    $ npm install

Run the tests with:

    $ make test


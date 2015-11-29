[![ID3 Writer logo](https://raw.githubusercontent.com/Jack12816/id3-writer/master/logo.png)]()

ID3 Writer is a small and tested library for writing ID3 tags to MP3
files. We don't touch the files self - we speak to write adapters like
id3lib/libid3-tools or eyeD3. So this library is just a wrapper around the CLI programs.

I don't plan to support Windows explicit. But if someone requests a pull
for a write adapter with Windows support I will not reject it.

[![Build Status](http://img.shields.io/travis/Jack12816/id3-writer.svg)](http://travis-ci.org/Jack12816/id3-writer)
[![Gittip](http://img.shields.io/gittip/Jack12816.png)](https://www.gittip.com/Jack12816/)
[![npm Downloads](http://img.shields.io/npm/dm/id3-writer.svg)](https://www.npmjs.org/package/id3-writer)
[![npm Version](http://img.shields.io/npm/v/id3-writer.svg)](https://www.npmjs.org/package/id3-writer)
[![Dependency Status](https://david-dm.org/jack12816/id3-writer.png)](https://david-dm.org/jack12816/id3-writer)
[![Code Climate](https://codeclimate.com/github/Jack12816/id3-writer/badges/gpa.svg)](https://codeclimate.com/github/Jack12816/id3-writer)
[![Coverage Status](https://coveralls.io/repos/Jack12816/id3-writer/badge.png)](https://coveralls.io/r/Jack12816/id3-writer)

## Features

* Support for multiple write adapters
    * We check if some binaries are available to do the tasks
        * eyeD3 (0.6.x, 0.7.x)
        * id3lib/libid3-tools (3.8.x)
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
    title: 'Song 2',
    album: 'Blur'
});

writer.setFile(file).write(meta, function(err) {

    if (err) {
        // Handle the error
    }

    // Done
});
```

### Write ID3 tags with an additional image

```js
// Load and assign modules
var id3 = require('id3-writer');
var writer = new id3.Writer();

var mp3 = new id3.File('/tmp/your.mp3');
var coverImage = new id3.Image('/tmp/cover.png');

var meta = new id3.Meta({
    artist: 'Blur',
    title: 'Song 2',
    album: 'Blur'
}, [coverImage]);

writer.setFile(mp3).write(meta, function(err) {

    if (err) {
        // Handle the error
    }

    // Done
});
```

### Supported metadata

| Tag                         | Description                          | libid3 notes                 | eyeD3 notes                                               |
| --------------------------- | ------------------------------------ | ---------------------------- | --------------------------------------------------------- |
| artist                      | Artist of the song                   | -                            | -                                                         |
| title (compatibility: song) | Title of the song                    | -                            | -                                                         |
| album                       | Album of the song                    | -                            | -                                                         |
| comment                     | Further user comments                | -                            | -                                                         |
| desc                        | User comment description             | -                            | Same as comment                                           |
| genre                       | Genre of the song                    | Needs to be a genre number   | All is possible: std ID3 genre names, ids and any other   |
| year                        | The year the song was recorded       | -                            | -                                                         |
| track                       | Position of the track on the album   | -                            | -                                                         |
| total                       | Amount of tracks on the album        | -                            | -                                                         |

#### ID3 genre list

| Id   | Name                | Id   | Name                | Id    | Name                     | Id    | Name                     |
| ---- | ------------------- | ---- | ------------------- | ----- | ------------------------ | ----- | ------------------------ |
| 0    | Blues               | 37   | Sound Clip          | 74    | Acid Jazz                | 112   | Club                     |
| 1    | Classic Rock        | 38   | Gospel              | 76    | Retro                    | 113   | Tango                    |
| 2    | Country             | 39   | Noise               | 77    | Musical                  | 114   | Samba                    |
| 3    | Dance               | 40   | AlternRock          | 78    | Rock & Roll              | 115   | Folklore                 |
| 4    | Disco               | 41   | Bass                | 79    | Hard Rock                | 116   | Ballad                   |
| 5    | Funk                | 42   | Soul                | 80    | Folk                     | 117   | Power Ballad             |
| 6    | Grunge              | 43   | Punk                | 81    | Folk-Rock                | 118   | Rhythmic Soul            |
| 7    | Hip-Hop             | 44   | Space               | 82    | National Folk            | 119   | Freestyle                |
| 8    | Jazz                | 45   | Meditative          | 83    | Swing                    | 120   | Duet                     |
| 9    | Metal               | 46   | Instrumental Pop    | 84    | Fast  Fusion             | 121   | Punk Rock                |
| 10   | New Age             | 47   | Instrumental Rock   | 85    | Bebob                    | 122   | Drum Solo                |
| 11   | Oldies              | 48   | Ethnic              | 86    | Latin                    | 123   | A Cappella               |
| 12   | Other               | 49   | Gothic              | 87    | Revival                  | 124   | Euro-House               |
| 13   | Pop                 | 50   | Darkwave            | 88    | Celtic                   | 125   | Dance Hall               |
| 14   | R&B                 | 51   | Techno-Industrial   | 89    | Bluegrass                | 126   | Goa                      |
| 15   | Rap                 | 52   | Electronic          | 90    | Avantgarde               | 127   | Drum & Bass              |
| 16   | Reggae              | 53   | Pop-Folk            | 91    | Gothic Rock              | 128   | Club-House               |
| 17   | Rock                | 54   | Eurodance           | 92    | Progressive Rock         | 129   | Hardcore                 |
| 18   | Techno              | 55   | Dream               | 93    | Psychedelic Rock         | 130   | Terror                   |
| 19   | Industrial          | 56   | Southern Rock       | 94    | Symphonic Rock           | 131   | Indie                    |
| 20   | Alternative         | 57   | Comedy              | 95    | Slow Rock                | 132   | BritPop                  |
| 21   | Ska                 | 58   | Cult                | 96    | Big Band                 | 133   | Negerpunk                |
| 22   | Death Metal         | 59   | Gangsta Rap         | 97    | Chorus                   | 134   | Polsk Punk               |
| 23   | Pranks              | 60   | Top 40              | 98    | Easy Listening           | 135   | Beat                     |
| 24   | Soundtrack          | 61   | Christian Rap       | 99    | Acoustic                 | 136   | Christian Gangsta Rap    |
| 25   | Euro-Techno         | 62   | Pop / Funk          | 100   | Humour                   | 137   | Heavy Metal              |
| 26   | Ambient             | 63   | Jungle              | 101   | Speech                   | 138   | Black Metal              |
| 27   | Trip-Hop            | 64   | Native American     | 102   | Chanson                  | 139   | Crossover                |
| 28   | Vocal               | 65   | Cabaret             | 103   | Opera                    | 140   | Contemporary Christian   |
| 29   | Jazz+Funk           | 66   | New Wave            | 104   | Chamber Music            | 141   | Christian Rock           |
| 30   | Fusion              | 67   | Psychedelic         | 105   | Sonata                   | 142   | Merengue                 |
| 31   | Trance              | 68   | Rave                | 106   | Symphony                 | 143   | Salsa                    |
| 32   | Classical           | 69   | Showtunes           | 107   | Booty Bass               | 144   | Thrash Metal             |
| 33   | Instrumental        | 70   | Trailer             | 108   | Primus                   | 145   | Anime                    |
| 34   | Acid                | 71   | Lo-Fi               | 109   | Porn Groove              | 146   | JPop                     |
| 35   | House               | 72   | Tribal              | 110   | Satire                   | 147   | Synthpop                 |
| 36   | Game                | 73   | Acid Punk           | 111   | Slow Jam                 | 148   | Rock/Pop                 |

## Running Tests

To run the test suite just run the following command, which installs the
development dependencies:

    $ npm install

Run the tests with:

    $ make test


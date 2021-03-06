
multiplex-objectMode is a wrapper for [multiplex-meta](https://github.com/biobricks/multiplex-meta) (itself a minor fork of [multiplex](https://github.com/maxogden/multiplex)) that lets you use the `objectMode` and `encoding` parameters when creating streams.

# Usage

```
var multiplex = require('multiplex-objectMode');

var plex1 = multiplex();

var stream1 = plex1.createStream(); // binary stream with auto-generated name

var stream2 = plex1.createStream(null, {
  encoding: 'utf8' // set encoding on both ends of stream to utf8
});

var stream3 = plex1.createStream(null, {
  objectMode: true // send and receive objects
});
 
var plex2 = multiplex(function onStream(stream, meta) {

  stream.on('data', function(data) {
    console.log("Data on stream '"+meta.name+"':", data);
  })
});
 
plex1.pipe(plex2);
 
stream1.write(new Buffer('stream one!'));
stream2.write("stream two!");
stream3.write({stream: "three"});
```

See examples/ for more.

# License

AGPLv3 (may be-dual licensed under MIT license soon)
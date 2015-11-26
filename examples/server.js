#!/usr/bin/env nodejs

try {
  var through = require('through2');
} catch(e) {
  console.error("This example requires that you: npm install through2");
  process.exit(1);
}

var net = require('net');
var Multiplex = require('../index.js');

var multiplex = Multiplex(function(stream, id) {

    console.log("server got stream:", id, typeof id);

    stream.pipe(through.obj(function(data, enc) {
        
        console.log("server got:", data, typeof data);

        stream.write({msg: "hello back"});

    })).pipe(stream);

});

multiplex.on('error', function(err) {
    console.error("Stream error:", err);
});

var server = net.createServer(function(con) {
    con.pipe(multiplex).pipe(con);
});

server.listen(1234);
console.log("Server listening");

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
    console.log("client got stream:", id);
});

var con = net.connect(1234);
con.pipe(multiplex).pipe(con);

var s1 = multiplex.createStream({
    name: '123'
}, {
    objectMode: true
});

s1.pipe(through.obj(function(data) {
  console.log("client got:", data, typeof data);
})).s1;

s1.write("hallo hallo");


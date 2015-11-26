
var util = require('util');
var xtend = require('xtend');
var Multiplex = require('multiplex'); // actually multiplex-meta
var jsonStream = require('duplex-json-stream');

var Wrapper = function(opts, onchannel) {
    if(!(this instanceof Wrapper)) return new Wrapper(opts, onchannel);

    if(typeof opts === 'function') {
        onchannel = opts;
        opts = null;
    }
    opts = opts || {};
    opts = xtend(opts, {objName: true});

    if(opts.objectMode) {
        opts.encoding = 'utf8';
    }
    this._opts = opts;
 
    var wrapOnchannel = function(stream, meta) {

        if(typeof meta !== 'object') {
            return onchannel(stream, meta);
        }

        var opts = meta._streamOpts;
        if(opts) {
            if(opts.encoding || opts.objectMode) {
                opts.encoding = opts.encoding || 'utf8';
                stream.setEncoding(opts.encoding);
                stream.setDefaultEncoding(opts.encoding);
            }
            if(opts.objectMode) {
                stream = jsonStream(stream);
            }
            delete meta._streamOpts;
        }
        return onchannel(stream, meta);
    };
    Multiplex.call(this, opts, wrapOnchannel);

    this.createStream = function(name, opts) {
        opts = (opts) ? xtend(opts, {}) : {};

        var encoding = opts.encoding || this._opts.encoding;
        var objectMode = opts.objectMode || this._opts.objectMode;
        if(objectMode && !encoding) {
            encoding = 'utf8';
        }

        var meta = {
            _streamOpts: {
                encoding: encoding,
                objectMode: objectMode
            }
        };

        if(typeof name === 'object') {
            meta = xtend(name, meta);
        } else {
            meta.name = name;
        }

        delete opts.encoding
        delete opts.objectMode

        var stream = Multiplex.prototype.createStream.call(this, meta, opts);

        if(encoding) {
            stream.setEncoding(encoding);
            stream.setDefaultEncoding(encoding);
        }
        if(objectMode) {
            stream = jsonStream(stream);
        }
        
        return stream;
    };
}

util.inherits(Wrapper, Multiplex);

module.exports = Wrapper;

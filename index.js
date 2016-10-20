var fs = require('fs');
var path = require('path');
var http = require('http');
var mkdirp = require('mkdirp');
var inherits = require('inherits');

var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;

var onexit = require('./lib/onexit');

module.exports = function (repoDir, opts) {
  if (!opts) opts = {};
  // var dirMap = typeof repoDir === 'function'
  // ? repoDir
  // : function (dir) { return path.join(repoDir, dir) }

  var dirMap = function(dir) {
    return path.join(repoDir,dir);
  }
  // : function () { repoDir }
  ;
  return new Git(dirMap, opts);
};

function Git (dirMap, opts) {
  EventEmitter.call(this);

  this.dirMap = dirMap;
  this.autoCreate = opts.autoCreate === false ? false : true;
  this.checkout = opts.checkout;
}

inherits(Git, EventEmitter);

Git.prototype.list = function (cb) {
  fs.readdir(this.dirMap(""), cb);
};

Git.prototype.exists = function (repo, cb) {
  (fs.exists || path.exists)(this.dirMap(repo), cb);
};

Git.prototype.mkdir = function (dir, cb) {
  mkdirp(this.dirMap(dir), cb);
};

Git.prototype.create = function (repo, cb) {
    console.log("CREEATING REPO");
    console.log('_0');
    var self = this;
    if (typeof cb !== 'function') cb = function () {};
    var cwd = process.cwd();

    if (!/\.git$/.test(repo)) repo += '.git';

    self.exists(repo, function (ex) {
	console.log('_1');
	if (!ex) self.mkdir(repo, next)
	else next()
    });

    function next (err) {
	console.log('_2');
	if (err) return cb(err);
	console.log('_3');

	var dir = self.dirMap(repo);
	if (self.checkout) {
	    var ps = spawn('git', [ 'init', dir ]);
	}
	else {
	    var ps = spawn('git', [ 'init', '--bare', dir ]);
	}

	var err = '';
	ps.stderr.on('data', function (buf) { err += buf });

	onexit(ps, function (code) {
	    console.log('_5');
	    if (!cb) {}
	    else if (code) cb(err || true)
	    else cb(null)
	});
    }
};

Git.prototype.handle = require('./lib/handle');

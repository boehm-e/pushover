module.exports = function (ps, cb) {
    var pending = 3;
    var code, sig;
    console.log("__0");
    function onend () {
	console.log("__1");
        if (--pending === 0) cb(code, sig);
    }
    ps.on('exit', function (c, s) {
	console.log("__2");
        code = c;
        sig = s;
    });
    ps.on('exit', onend);
    ps.stdout.on('end', onend);
    ps.stderr.on('end', onend);
};

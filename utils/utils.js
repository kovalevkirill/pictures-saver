const mkdirp = require('mkdirp');

let createFolders = function (path, deviceId) {
    let dirPaths = [deviceId],
        tmpDirName = '';

    for (let i = 1; i < path.length; i++) {
        if (path[i] == '/') {
            dirPaths.push(tmpDirName);
            tmpDirName = '';
            continue;
        }

        tmpDirName += path[i];
    }

    dirPaths.push(tmpDirName);

    if (dirPaths.length) {
        mkdirp.sync(dirPaths.join('/'), function (err) {
            if (err) console.error(err);
            else console.log('pow!');
        });
    }

    return './' + dirPaths.join('/');
};

function isAuthenticated(req, res, next) {
    if (req.cookie && req.cookie.userName) {
        return next();
    }

    res.redirect('/');
}

module.exports = {
    createFolders,
    isAuthenticated
};

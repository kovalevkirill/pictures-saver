const mkdirp = require('mkdirp');

let createFolders = function (path, deviceId) {
    let dirPath = './store/' + deviceId,
        res = path.split('/');

    res.pop();

    /*let dirPaths = [deviceId],
     tmpDirName = '';

     for (let i = 1; i < path.length; i++) {
     if (path[i] == '/') {
     dirPaths.push(tmpDirName);
     tmpDirName = '';
     continue;
     }

     tmpDirName += path[i];
     }

     dirPaths.push(tmpDirName);*/
    dirPath = dirPath + res.join('/');

    console.log(dirPath + res.join('/'));

    mkdirp.sync(dirPath, function (err) {
        if (err) console.error(err);
        else console.log('pow!');
    });

    return dirPath;
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

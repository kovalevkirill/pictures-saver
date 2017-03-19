const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');


const config = require('./config');
const {userObj} = config;
const utils = require('./utils/utils');
const serveIndex = require('serve-index');

const mkdirp = require('mkdirp');
const multer = require('multer');
const morgan = require('morgan');
const mime = require('mime');
const jsonfile = require('jsonfile');
const fs = require('fs');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.use(express.static(path.join(__dirname, './views/assets')));
app.use('/static', express.static(__dirname + '/views/assets'));
app.use('/data', express.static(__dirname + '/store'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('combined'));
app.use(session({
    secret: userObj.secret,
    cookie: {maxAge: 60000},
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser(userObj.secret));
app.use('/data', serveIndex(
    './store',
    {
        'icons': true,
        'template': './views/template.html'
    }));

app.get('/data', (req, res) => {
    if (req.signedCookies && req.signedCookies.userName) {
        console.log('ok ftp');
        res.send(200);
    } else {
        console.log('no auth');
        res.redirect('/login');
    }
});


app.get('/', (req, res) => {
    if (req.signedCookies && req.signedCookies.userName) {
        res.redirect('/data');
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    if (req.signedCookies && req.signedCookies.userName) {
        res.redirect('/data');
    } else {
        res.render('login.html');
    }
});

app.post('/check_password', (req, res) => {
    let {password} = JSON.parse(fs.readFileSync('user.json', {encoding: 'utf-8'})),
        checkPassword = req.body.password;

    if (checkPassword && password === checkPassword) {
        res.status(200).json({isValid: true});
    } else {
        res.status(400).json({isValid: false});
    }
});

app.post('/password', (req, res) => {
    let {password} = req.body,
        newPassword = {
            username: "admin",
            password
        };

    fs.writeFile('user.json', JSON.stringify(newPassword), (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({message: err});
        } else {
            res.status(200).json({message: 'Update password is correct'});
        }
    });
});

app.post('/exit', (req, res) => {
    req.session.destroy();
    res.clearCookie("userName");
    res.redirect('/login');
});

app.post('/login', (req, res) => {
    console.log(req.body);
    let userData = JSON.parse(fs.readFileSync('user.json', {encoding: 'utf-8'}));
    let {username, password} = req.body;

    if (username === userData.username && password == userData.password) {
        let cookie = req.cookie;

        if (cookie === undefined) {
            let options = {
                maxAge: 1000 * 60 * 15, // would expire after 15 minutes
                httpOnly: true, // The cookie only accessible by the web server
                signed: true // Indicates if the cookie should be signed
            };

            res.cookie('userName', username, options);
        }

        res.redirect('/data');
    } else {
        res.redirect('/error-login');
    }
});

app.get('/error-login', (req, res) => {
    res.render('error-login.html');
});

app.post('/upload', (req, res) => {
    let storage = multer.diskStorage({
        destination: function (req, file, callback) {
            console.log('create folders');
            let {createPath} = utils.createFolders(req.body.pathToImg, req.body.deviceId);

            callback(null, createPath);
        },
        filename: function (req, file, callback) {
            console.log('create files');
            console.log('******');
            console.log(req.body);
            let {pathToImg} = req.body,
                pathArray = pathToImg.split('/'),
                fileName = pathArray[pathArray.length - 1];

            console.log(typeof  fileName);

            console.log(pathArray[pathArray.length - 1]);

            //console.log(pathArray[pathArray.length - 1]);

            callback(null, fileName);
        }
    });

    let upload = multer({storage: storage}).fields([
        {name: 'image', maxCount: 1, type: 'file'},
        {name: 'pathToImg'},
        {name: 'deviceId'}
    ]);

    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

app.listen(config.serverPort, (req, res) => {
    console.log(`Server running on port ${config.serverPort}`);
});
const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');

const config = require('./config');
const {userObj} = config;
const utils = require('./utils/utils');

const fs = require('fs');
const mkdirp = require('mkdirp');
const multer = require('multer');
const morgan = require('morgan');
const mime = require('mime');

app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('combined'));
//app.use(cookieParser);

app.get('/', (req, res) => {
    res.send('Hello');
});

app.post('/login', (req, res) => {
    console.log(req.body);

    let {username, password} = req.body;

    if (username === userObj.username && password == userObj.password) {
        res.status(200).json({message: "Authorithed"});
    } else {
        res.status(404).json({message: "Wrong login or password"})
    }
});

app.post('/upload', (req, res) => {
    let storage = multer.diskStorage({
            destination: function (req, file, callback) {
                console.log('create folders');
                console.log(req.body);
                let createPath = utils.createFolders(req.body.pathToImg, req.body.deviceId);

                console.log(createPath);

                callback(null, createPath);
            },
            filename: function (req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
            }
        });

    let upload = multer({storage: storage}).fields([
        {name: 'userPhoto', maxCount: 1, type: 'file' },
        {name:'pathToImg'},
        {name:'deviceId'}]
    );

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
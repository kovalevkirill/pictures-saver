const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config');
const {userObj} = config;
const FormData = require('form-data');
const fs = require('fs');


app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json());
app.use(cookieParser);

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

app.post('/image', (req, res)=> {
    console.log(req.body);
    res.sendStatus(200);
});

app.listen(config.serverPort, (req, res) => {
    console.log(`Server running on port ${config.serverPort}`);
});
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./model/user_model');

var app = express();

var jsonParser = bodyParser.json();


/* 
  CRUD Endpoints
*/
// GET/Read
app.get('/users', function(req, res) {
    User.find(function(err, users) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(users);
    });
});

// POST
app.post('/users', jsonParser, function(req, res) {
    if (!req.body) {
        return res.status(400).json({
            message: "No request body"
        });
    }

    if (!('username' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }

    var username = req.body.username;

    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }

    username = username.trim();

    if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }

    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }

    var password = req.body.password;

    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }

    var user = new User({
        username: username,
        password: password
    });

    user.save(function(err) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        return res.status(201).json({});
    });
});

mongoose.connect('mongodb://localhost/auth').then(function() {
    app.listen(8080);
});

'use strict';

var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var ObjectId = require('mongoose').Types.ObjectId;
var validationError = function(res, err) {
    return res.json(422, err);
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
    req.session.sfsdf=2;
    console.log(req.session);
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

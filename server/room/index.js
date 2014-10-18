'use strict';

var express = require('express');
var controller = require('./room.controller');
var config = require('../config/environment');
var auth = require('../auth/auth.service');
var router = express.Router();

router.get('/create',  controller.create);

module.exports = router;

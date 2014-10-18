'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  storage: '',

  // Server port
  port: process.env.WS_PORT || 9000,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'ws-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  facebook: {
    clientID:     process.env.WS_FACEBOOK_ID || 'id',
    clientSecret: process.env.WS_FACEBOOK_SECRET || 'secret',
    callbackURL:  process.env.WS_DOMAIN || '' + '/auth/facebook/callback'
  },

  twitter: {
    clientID:     process.env.WS_TWITTER_ID || 'id',
    clientSecret: process.env.WS_TWITTER_SECRET || 'secret',
    callbackURL:  process.env.WS_DOMAIN || '' + '/auth/twitter/callback'
  },

  google: {
    clientID:     process.env.WS_GOOGLE_ID || 'id',
    clientSecret: process.env.WS_GOOGLE_SECRET || 'secret',
    callbackURL:  process.env.WS_DOMAIN || '' + '/auth/google/callback'
  }
};

// Export the config object based on the WS_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
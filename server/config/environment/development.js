'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://coboard:coboard@albulescu.ro/coboard_development'
  },

  seedDB: true,

  facebook: {
    clientID:     '',
    clientSecret: '',
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

'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       undefined,

  // Server port
  port:     8081,
  
  securePort: 8082,

  facebook: {
    clientID:     '',
    clientSecret: '',
    callbackURL:  process.env.WS_DOMAIN || '' + '/auth/facebook/callback'
  },

  // MongoDB connection options
  mongo: {
    uri:    'mongodb://coboard:coboard@albulescu.ro/coboard_development'
  }
};
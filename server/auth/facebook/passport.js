var passport = require('passport');
var request = require('request');
var fs = require('fs');
var _ = require('lodash');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../../config/environment');

/**
 * Fetch image from facebook
 */
var fetchImage = function( id ) {
    var url = 'http://graph.facebook.com/'+id+'/picture?width=150';
    request( url ).pipe( fs.createWriteStream(config.storage + '/' + id + '.png') );
};

exports.setup = function (User, config) {
  console.log(config);
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {

      User.findOne({
        'facebook.id': profile.id
      },
      function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {

          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            username: profile.username,
            provider: 'facebook',
            facebook: _.merge(profile._json,{
              token: accessToken
            })
          });
          user.save(function(err) {
            if (err) done(err);
            return done(err, user);
          });
        } else {
          console.log('update facebook token');
          user.set('facebook.token', accessToken);
          user.save(function(){
            if (err) done(err);
            return done(err, user);
          });
        }
      })
    }
  ));
};
// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
const jwt = require('passport-jwt')
const db = require('../models')
const AnonymousStrategy = require('passport-anonymous');

const Users = db.users

const opts = {}
opts.jwtFromRequest = jwt.ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = 'secret'
// opts.Authorization = 'Bearer ' + {token};

// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

// create jwt strategy
module.exports = passport => {
  passport.use(
    new jwt.Strategy(opts, (jwt_payload, done) => {
      console.log(jwt_payload)
      Users.findOne({ where: { login: jwt_payload.login } })
        .then(user => {
          console.log(user)
          if (user) {
            return done(null, user)
          }
          return done(null, false)
        })
        .catch(err => console.log(err))
    })
  );
  passport.use(new AnonymousStrategy.Strategy());
}

require('dotenv').config();
var passport = require('passport');
const express = require('express');
const port = 3000;

var BnetStrategy = require('passport-bnet').Strategy;
var BNET_ID = process.env.BNET_ID
var BNET_SECRET = process.env.BNET_SECRET
 
// Use the BnetStrategy within Passport.
passport.use(new BnetStrategy({
    clientID: BNET_ID,
    clientSecret: BNET_SECRET,
    callbackURL: "https://localhost:3000/auth/bnet/callback",
    region: "us"
}, function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

const app = express();

app.get('/', (req, res) => {
    res.send('visit /oauth/battlenet to login with Blizzard oauth');
});

app.get('/oauth/battlenet',
    passport.authenticate('bnet'));

app.get('/oauth/battlenet/callback',
    passport.authenticate('bnet', { failureRedirect: '/' }),
    function(req, res){
        res.redirect('/');
    });

app.listen(port, () => console.log(`listening on port ${port}`));
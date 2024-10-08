// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Initiate Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:8080/dashboard'); // Redirect to your Vue frontend after successful login
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;

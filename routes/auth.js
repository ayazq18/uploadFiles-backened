const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/google/callback',(req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/' }, async (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/');
    }

    // Manually log in the user (since we're using a custom callback)
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      // Optionally, perform additional logic here (e.g., sending data to frontend)

      // Redirect to the frontend dashboard after successful login
      res.redirect('http://localhost:8080/dashboard');
    });
  })(req, res, next);
});

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/session', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: req.user,
      isAuthenticated: true,
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Get current user info
router.get('/current_user', (req, res) => {
  if (!req.user) {
    return null
  }
  res.status(201).json(req.user); // Send error if not authenticated
});


module.exports = router;
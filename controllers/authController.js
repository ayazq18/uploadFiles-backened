const passport = require('passport');

exports.googleCallback = (req, res) => {
    // Handle the authenticated user information
    res.redirect('/dashboard');
};

exports.logout = (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.redirect('/');
    });
};

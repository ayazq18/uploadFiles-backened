const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

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

    // Manually log in the user
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      // Redirect to the frontend dashboard after successful login
      res.redirect('https://upload-files-phi.vercel.app/dashboard');
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
  res.status(201).json(req.user);
});

router.post('/user/login', async(req, res) => {
  try{
    const {email,password}=req.body;
   let user = await User.findOne({ email:email });
     if (!user) {
       res.status(404).json({message:"User Not Found"});
     }
     else{
       if(!user.password){
         const val= await User.findOneAndUpdate(
           { email:email },
           { $set: { password: password } },
           { new: true }
         );
         res.status(200).json({message:"Login Success",user:val});
       }
       else{
         if(user.password==password){
           res.status(200).json({message:"Login Success",user});
         }
         else{
           res.status(404).json({message:"Password is Incorrect"});
         }
       }
     }
   }
   catch(error){
     console.log(error.message)
     res.status(500).json({message:error.message});
 
  }
 });
 
 router.post('/user/register',  async(req, res) => {
  try{
    const {email,password,Name}=req.body;
   let user = await User.findOne({ email:email });
   if (!user) {
     if(!password){
       res.status(404).json({message:"Password is required"});
       return;
     }
     const newuser = await User.create({
       Name:Name,
       email: email,
       password:password,
     });
       res.status(200).json({message:"Register Success",user:newuser});
     }
     else{
       res.status(404).json({message:"User Already Exist"});
     }
   }
   catch(error){
     res.status(500).json({message:error.message});
  }
 });


module.exports = router;
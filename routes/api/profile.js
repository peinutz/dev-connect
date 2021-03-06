const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profile")
const User = require("../../models/User")
const validateProfileInput = require("../../validation/profile")


// @route GET api/profile/
// @desc Get current user profile
// @access Private
router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const errors = {}

  Profile.findOne({
      user: req.user.id
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'No profile for this user.'
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
})

// @route POST api/profile/
// @desc Create or edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  const {
    errors,
    isValid
  } = validateProfileInput(req.body);

  if (!isValid)
    return res.status(400).json(errors);

  const profileFields = {};
  profileFields.user = req.user.id;

  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  // Skills - Spilt into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      if (profile) {
        //Update profile
        Profile.findOneAndUpdate({
          user: req.user.id
        }, {
          $set: profileFields
        }, {
          new: true
        }).then(profile => res.json(profile));
      } else {
        //Create profile
        Profile.findOne({
          handle: profileFields.handle
        }).then(profile => {
          if (profile) {
            errors.handle = 'That handle is already taken.';
            res.status(400).json(errors);
          }

          //Save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        })
      }
    })
});

// @route GET api/profile/handle/:handle
// @desc Get profile by handler
// @access Public
router.get("/handler/:handle", (req, res) => {
  const errors = {}
  Profile.findOne({
      handle: req.params.handle
    }).populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        error.profile = 'No profile for the user';
        res.status(404).json(error);
      }
      res.json(profile);
    }).catch(err => res.status(404).json(err));
});

// @route GET api/profile/user/:user_id
// @desc Get profile by userId
// @access Public
router.get("/user/:userId", (req, res) => {
  const errors = {};

  Profile.findOne({
      user: req.params.userId
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        error.profile = 'No profile for the user';
        res.status(404).json(error);
      }
      res.json(profile);
    }).catch(err => res.status(404).json(err));
});

// @route GET api/profile/all
// @desc Get all routes
// @access Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find({})
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.profiles = 'No profiles'
        res.status(404).json(errors);
      }
      res.json(profiles);
    }).catch(err => json.status(500).json(err))
})

module.exports = router;
const router = require('express').Router();

const authController = require('../controllers/auth');
const passportService = require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });

router.route('/signup')
    .post(authController.signup);

router.route('/signin')
    .post(requireSignIn, authController.signin);

module.exports = router;
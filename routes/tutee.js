const express = require('express')
const reqReceived = require('../middlewares/reqReceived');
const { tuteeValidator } = require('../middlewares/utils/validators');
const router = express.Router()
const {
    postTutee,
    getTutees,
    deleteTutees,
    getTutee,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    deleteTutee,
    updateTutee,
    enroll
} = require('../controllers/tuteeController');
const protectedRouteForTutee = require('../middlewares/authTutee');
const {adminValidator} = require('../middlewares/utils/validators')

router.route('/')
      .get(reqReceived, adminValidator, getTutees)
      .post(reqReceived, tuteeValidator, postTutee)
      .delete(reqReceived, adminValidator, deleteTutees)

router.route('/login')
      .post(reqReceived, login)

router.route('/logout')
      .get(reqReceived, protectedRouteForTutee, logout)

router.route('/forgotpassword')
      .post(reqReceived, forgotPassword)

router.route('/updatepassword')
      .put(reqReceived, protectedRouteForTutee, updatePassword)

router.route('/resetpassword')
      .put(reqReceived, resetPassword)

router.route('/:tuteeId')
      .get(reqReceived, getTutee)
      .delete(reqReceived, protectedRouteForTutee, deleteTutee)
      .put(reqReceived, protectedRouteForTutee, updateTutee)

router.route('/:tuteeId/:sessionId')
      .post(reqReceived, protectedRouteForTutee, enroll)

module.exports = router
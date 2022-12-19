const express = require('express')
const reqReceived = require('../middlewares/reqReceived');
const { tuteeValidator } = require('../middlewares/utils/validators');
const router = express.Router()
const {getTuteeSessions} = require('../controllers/tuteeController')
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
const protectedRouteForTutor = require('../middlewares/authTutor');
const {adminValidator} = require('../middlewares/utils/validators')

router.route('/')
      .get(reqReceived, protectedRouteForTutor, adminValidator, getTutees)
      .post(reqReceived, tuteeValidator, postTutee)
      .delete(reqReceived, protectedRouteForTutor, adminValidator, deleteTutees)

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

router.route('/:tuteeId/session')
      .get(reqReceived, protectedRouteForTutee , getTuteeSessions)
      .post(reqReceived, protectedRouteForTutee, enroll)

// router.route('/:tuteeId/session/:sessionId')
//       .post(reqReceived, protectedRouteForTutee, enroll)

module.exports = router
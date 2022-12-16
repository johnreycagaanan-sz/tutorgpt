const express = require('express')
const reqReceived = require('../middlewares/reqReceived');
const { tutorValidator } = require('../middlewares/utils/validators');
const router = express.Router()
const {
    postTutor,
    getTutors,
    deleteTutors,
    getTutor,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword
} = require('../controllers/tutorController');
const protectedRouteForTutor = require('../middlewares/authTutor');
const {adminValidator} = require('../middlewares/utils/validators')

router.route('/')
      .get(reqReceived, getTutors)
      .post(reqReceived, tutorValidator, postTutor)
      .delete(reqReceived, adminValidator, deleteTutors)

router.route('/:tutorId')
      .get(reqReceived, getTutor)

router.route('/login')
      .post(reqReceived, login)

router.route('/logout')
      .get(reqReceived, protectedRouteForTutor, logout)

router.route('/forgotpassword')
      .post(reqReceived, forgotPassword)

router.route('/updatepassword')
      .put(reqReceived, protectedRouteForTutor, updatePassword)

router.route('/resetpassword')
      .put(reqReceived, resetPassword)

module.exports = router
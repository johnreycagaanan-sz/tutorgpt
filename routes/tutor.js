const express = require('express')
const reqReceived = require('../middlewares/reqReceived');
const { tutorValidator } = require('../middlewares/utils/validators');
const router = express.Router()
const {
    postTutor,
    getTutors,
    deleteTutors,
    login,
    logout
} = require('../controllers/tutorController');
const protectedRouteForTutor = require('../middlewares/authTutor');
router.route('/')
      .get(reqReceived, getTutors)
      .post(reqReceived, tutorValidator, postTutor)
      .delete(reqReceived, deleteTutors)

router.route('/login')
      .post(reqReceived, login)

router.route('/logout')
      .get(reqReceived, protectedRouteForTutor, logout)

module.exports = router
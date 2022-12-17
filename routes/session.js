const express = require('express')
const router = express.Router()
const reqReceived = require('../middlewares/reqReceived');
const {adminValidator} = require('../middlewares/utils/validators')
const {
    getSessions,
    addSession
} = require('../controllers/sessionController');
const protectedRouteForTutor = require('../middlewares/authTutor');

router.route('/')
      .get(reqReceived, adminValidator, getSessions)
      .post(reqReceived, protectedRouteForTutor, addSession)

module.exports = router
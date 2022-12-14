const express = require('express')
const reqReceived = require('../middlewares/reqReceived');
const router = express.Router()
const {
    postTutor
} = require('../controllers/tutorController')
router.route('/')
      .get(reqReceived)
      .post(reqReceived, postTutor)
module.exports = router
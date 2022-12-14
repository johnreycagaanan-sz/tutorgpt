const express = require('express')
const reqReceived = require('../middlewares/reqReceived');
const router = express.Router()
const {
    postTutor,
    getTutors,
    deleteTutors
} = require('../controllers/tutorController')
router.route('/')
      .get(reqReceived, getTutors)
      .post(reqReceived, postTutor)
      .delete(reqReceived, deleteTutors)
module.exports = router
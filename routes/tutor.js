const express = require('express')
const reqReceived = require('../middlewares/reqReceived');
const { tutorValidator } = require('../middlewares/utils/validators');
const router = express.Router()
const {
    postTutor,
    getTutors,
    deleteTutors,
    login
} = require('../controllers/tutorController')
router.route('/')
      .get(reqReceived, getTutors)
      .post(reqReceived, tutorValidator, postTutor)
      .delete(reqReceived, deleteTutors)

router.route('/login')
      .post(reqReceived, login)
module.exports = router
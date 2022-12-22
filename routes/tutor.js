const express = require('express')
const reqReceived = require('../middlewares/reqReceived');
const { tutorValidator } = require('../middlewares/utils/validators');
const {
      getSessions,
      addSession,
      deleteSessions,
      getSession,
      deleteSession,
      updateSession
} = require('../controllers/sessionController')
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
    updatePassword,
    deleteTutor,
    updateTutor,
    getTutorSessions
} = require('../controllers/tutorController');
const protectedRouteForTutor = require('../middlewares/authTutor');
const {adminValidator} = require('../middlewares/utils/validators')

router.route('/')
      .get(reqReceived, getTutors)
      .post(reqReceived, tutorValidator, postTutor)
      .delete(reqReceived, protectedRouteForTutor, adminValidator, deleteTutors)

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

router.route('/:tutorId')
      .get(reqReceived, getTutor)
      .delete(reqReceived, protectedRouteForTutor, deleteTutor)
      .put(reqReceived, protectedRouteForTutor, updateTutor)

router.route('/:tutorId/session')
      .get(reqReceived, getTutorSessions)
      .post(reqReceived, protectedRouteForTutor, addSession)
      .delete(reqReceived, protectedRouteForTutor, deleteSessions)

router.route('/:tutorId/session/:sessionId')
      .get(reqReceived, getSession)
      .delete(reqReceived, protectedRouteForTutor, deleteSession)
      .put(reqReceived, protectedRouteForTutor, updateSession)



module.exports = router
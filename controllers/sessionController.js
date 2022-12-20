const Session = require('../models/Session');
const Tutor = require('../models/Tutor');
const Tutee = require('../models/Tutee');
const twilio = require('twilio')
const dotenv = require('dotenv');
dotenv.config({ path: '../config/config.env'});
let accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_FROM
const getSessions = async(req, res, next) => {
    const filter = {};
    const options = {};
    if (Object.keys(req.body).length){
        const {
            subject,
            startTime,
            endTime,
            limit,
            sortBySubject
        } = req.query;
        
        if (subject) filter.subject = true;
        if (startTime) filter.startTime = true;
        if (endTime) filter.endTime = true
        if (limit) options.limit = limit;
        if (sortBySubject) options.sort = {
            name: sortBySubject === 'asc' ? 1: -1
        }

    }
    try {
        const sessions = await Session.find({}, filter, options);
        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json(sessions)
    } catch (err) {
        throw new Error(`Error retrieving sessions: ${err.message}`);
    }
}

const addSession = async(req, res, next) => {
    const tutor = await Tutor.findOne({ _id : req.params.tutorId})
    try {
        const session = await Session.create({...req.body, tutorName: tutor._id});
        const sendTo = tutor.phoneNumber
        const message_body = `You have made a new session of subject ${session.subject} starting at
        ${session.startTime} until ${session.endTime}`

        const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        client.messages.create({
            body: message_body,
            to: sendTo,
            from: process.env.TWILIO_FROM
        }).then((message) => console.log(message.sid));

        res
            .status(201)
            .setHeader('Content-Type', 'application/json')
            .json(session)
    } catch (err) {
        throw new Error(`Error creating session: ${err.message}`);
    }
}

const deleteSessions = async(req, res, next) => {
    try {
        // const deletedSessions = await Session.deleteMany();
        // const deletedSessionIds = deletedSessions.map(session => session._id);
        // await Tutee.updateMany({}, { $pull: { enrolledStudents: { $in: deletedSessionIds } } });
           
        await Session.deleteMany();
        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json({success:true, msg: 'Sessions deleted'})
    } catch (err) {
        throw new Error(`Error deleting sessions: ${err.message}`);
    }
}

const getSession = async(req, res, next) => {
    try {
        const session = await Session.findById(req.params.sessionId);
        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json(session)
    } catch (err) {
        throw new Error(`Error retrieving session ${req.params.sessionId}: ${err.message}`);
    }
}

const deleteSession = async(req, res, next) => {
    try {
        await Session.findByIdAndDelete(req.params.sessionId);
        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json({success:true, msg: `Deleting session: ${req.params.sessionId}`})
    } catch (err) {
        throw new Error(`Error deleting session ${req.params.sessionId}: ${err.message}`);
    }
    
}

const updateSession = async(req, res, next) => {
    try {
        const session = await Session.findByIdAndUpdate(req.params.sessionId,{
            $set: req.body
        },{
            new: true
        });
        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json(session)
    } catch (err) {
        throw new Error(`Error updating session ${req.params.sessionId}: ${err.message}`)
    }
    
};

module.exports = {
    getSessions,
    addSession,
    deleteSessions,
    getSession,
    deleteSession,
    updateSession
}
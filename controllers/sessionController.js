const Session = require('../models/Session');
const Tutor = require('../models/Tutor');
const Tutee = require('../models/Tutee');
const twilio = require('twilio')
const dotenv = require('dotenv');
dotenv.config({ path: '../config/config.env'});
const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')
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
        const sessions = await Session.find({}, filter, options)
        .populate('tutor', 'tutorName')
        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json(sessions)
    } catch (err) {
        throw new Error(`Error retrieving sessions: ${err.message}`);
    }
}

const deleteSessions = async(req, res, next) => {
    try {
        await Session.deleteMany();
        await Tutor.updateMany({}, { $unset: { sessionsEnrolled: "" } });
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
        const session = await Session.findById(req.params.sessionId)
        .populate('tuteesEnrolled', 'tuteeName age gender email');
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
const addSession = async(req, res, next) => {
    const tutor = await Tutor.findOne({ _id : req.params.tutorId})
    try {
        const utcStart = zonedTimeToUtc(req.body.startTime, 'Asia/Kuala_Lumpur')
        const utcEnd = zonedTimeToUtc(req.body.endTime, 'Asia/Kuala_Lumpur')

        // const utcStartDate = new Date(utcStart)
        // const utcEndDate = new Date(utcEnd)
        // const zonedStart = utcToZonedTime(utcStartDate, 'Asia/Kuala_Lumpur')
        // const zonedEnd = utcToZonedTime(utcEndDate, 'Asia/Kuala_Lumpur')
        // console.log(zonedStart)
        // console.log(zonedEnd)

        const session = await Session.create({...req.body, tutor: tutor._id, startTime: utcStart, endTime: utcEnd});
        res
            .status(201)
            .setHeader('Content-Type', 'application/json')
            .json(session)
    } catch (err) {
        throw new Error(`Error creating session: ${err.message}`);
    }
}

// const sendTextMessage = (tutor, session) => {
//     const sendTo = tutor.phoneNumber
//     const sendTo2 = '+639061783380'

//     console.log(`SENDING TEXT MESSAGE TO ${sendTo}`)

//     const utcStartDate = new Date(session.startTime)
//     const utcEndDate = new Date(session.endTime)
//     const zonedStart = utcToZonedTime(utcStartDate, 'Asia/Kuala_Lumpur')
//     const zonedEnd = utcToZonedTime(utcEndDate, 'Asia/Kuala_Lumpur')
    
//     console.log(process.env.TWILIO_ACCOUNT_SID)
//     console.log(process.env.TWILIO_AUTH_TOKEN)
//     console.log(process.env.TWILIO_FROM)


//         const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//         const message_body = `You have made a new session of subject ${session.subject} starting at
//         ${zonedStart} until ${zonedEnd}`
//         console.log(message_body)
//         console.log(client)
//         client.messages.create({
//             body: message_body,
//             to: sendTo,
//             from: process.env.TWILIO_FROM
//         }).then((message) => console.log(message));
// }

module.exports = {
    getSessions,
    addSession,
    deleteSessions,
    getSession,
    deleteSession,
    updateSession
}
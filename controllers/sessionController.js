const Session = require('../models/Session');
const Tutor = require('../models/Tutor');


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
        const session = await Session.create({...req.body, tutorName: tutor.tutorName});
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

const enroll = async(req, res, next) => {
    
}

module.exports = {
    getSessions,
    addSession,
    deleteSessions,
    getSession,
    deleteSession,
    updateSession
}
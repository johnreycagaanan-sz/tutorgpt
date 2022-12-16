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

console.log('Hello world')
module.exports = {
    getSessions,
    addSession
}
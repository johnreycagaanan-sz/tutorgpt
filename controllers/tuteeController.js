const Tutee = require('../models/Tutee');
const Session = require('../models/Session');
const crypto = require('crypto');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: '../config/config.env'});
const twilio = require('twilio')

const sendTokenResponse = (tutee, statusCode, res) => {
    const token = tutee.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production')  {
        options.secure = true
    }
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({success: true, token})
}

const login = async(req, res, next) => {
    const {userName, password } = req.body

    if(!userName || !password) throw new Error ('Please provide username and password')

    const tutee = await Tutee.findOne({userName}).select('+password')
    
    if(!tutee) throw new error ('Invalid credentials')

    const isMatch = await tutee.matchPassword(password);

    if(!isMatch) throw new Error('Invalid credentails')
    sendTokenResponse(tutee, 200, res)
}

const logout = async(req, res, next) => {
    res
        .status(200)
        .cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        })
        .json({success: true, msg: `Successfully logged out`})
    
        
}

const forgotPassword = async(req, res, next) => {
    const tutee = await Tutee.findOne({userName: req.body.userName})

    if(!tutee) throw new Error('No tutee found');

    const resetToken = tutee.getResetPasswordToken();

    try {
        await tutee.save({ validateBeforeSave: false })
        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json({succes: true, msg: `Password has been reset with token: ${resetToken}`})
    } catch (err) {
        tutee.resetPasswordToken = undefined;
        tutee.resetPasswordExpire = undefined;

        await tutee.save({ validateBeforeSave: false })
        throw new Error(`Failed to save new password`)
    }
}

const resetPassword = async(req, res, next) => {
    // console.log(resetPasswordToken)
    const resetPasswordToken = crypto.createHash('sha256').update(req.query.resetToken).digest('hex');
    const tutee = await Tutee.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    

    if(!tutee) throw new Error('Invalid token');
    console.log(req.body.password)

    tutee.password = req.body.password;
    tutee.resetPasswordExpire = undefined;
    tutee.resetPasswordToken = undefined;

    await tutee.save();

    sendTokenResponse(tutee, 200, res)
}

const updatePassword = async(req, res, next) => {
    const tutee = await Tutee.findById(req.tutee.id).select('+password');

    const passwordMatches = await tutee.matchPassword(req.body.password);

    if(!passwordMatches) throw new Error('Password is incorrect');
    tutee.password = req.body.newPassword

    await tutee.save();
    sendTokenResponse(tutee, 200, res)
}

const getTutees = async(req, res, next) => {
    const filter = {};
    const options = {};
    if (Object.keys(req.body).length){
        const {
            tuteeName,
            email,
            limit,
            sortByName
        } = req.query;
        
        if (tuteeName) filter.tuteeName = true;
        if (email) filter.email = true;

        if (limit) options.limit = limit;
        if (sortByName) options.sort = {
            name: sortByName === 'asc' ? 1: -1
        }

    }
    try {
        const tutees = await Tutee.find({}, filter, options);
        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json(tutees)
    } catch (err) {
        throw new Error(`Error retrieving tutees: ${err.message}`);
    }
}

const postTutee = async(req, res, next) => {
    try {
        const tutee = await Tutee.create(req.body);
        res
            .status(201)
            .setHeader('Content-Type', 'application/json')
            .json(tutee)
    } catch (err) {
        throw new Error(`Error creating tutee: ${err.message}`);
    }
}

    const deleteTutees = async (req, res, next) => {
        try {
        // const deletedTutees = await Tutee.deleteMany();
        // const deletedTuteeIds = deletedTutees.map(tutee => tutee._id);
        // await Session.updateMany({}, { $pull: { enrolledStudents: { $in: deletedTuteeIds } } });
        await Tutee.deleteMany();
           
            res
                .status(200)
                .setHeader('Content-Type', 'application/json')
                .json({success:true, msg: 'Tutees removed'})
        } catch (err) {
            throw new Error(`Error removing tutees: ${err.message}`);
        }
    
    }

const getTutee = async(req, res, next) => {
    try {
        const tutee = await Tutee.findById(req.params.tuteeId);
        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json(tutee)
    } catch (err) {
        throw new Error(`Error retrieving tutee ${req.params.tuteeId}: ${err.message}`);
    }
    
}

// const deleteTutee = async(req, res, next) => {
//     try {
//         await Tutee.findByIdAndDelete(req.params.tuteeId);
//         res
//             .status(200)
//             .setHeader('Content-Type', 'application/json')
//             .json({success:true, msg: `Deleting tutee: ${req.params.tuteeId}`})
//     } catch (err) {
//         throw new Error(`Error deleting tutee ${req.params.tuteeId}: ${err.message}`);
//     }
    
// }

const deleteTutee = async (req, res, next) => {
    try {
        const { enrolledSessions } = await Tutee.findById(req.params.tuteeId)
        

        for (let session of enrolledSessions) {
            const sessionToDeleteForTutee = await Session.findById(session._id)
            sessionToDeleteForTutee.tuteesEnrolled = 
            sessionToDeleteForTutee.tuteesEnrolled.map( tutee => !(tutee._id).equals(req.params.tuteeId) )
            await sessionToDeleteForTutee.save(); 
        }

        await Tutee.findByIdAndDelete(req.params.tuteeId);

        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json({success:true, msg: `Deleting tutee: ${req.params.tuteeId}`})
    } catch (err) {
        throw new Error(`Error deleting tutee ${req.params.tuteeId}: ${err.message}`);
    }
    
}
const updateTutee = async(req, res, next) => {
    try {
        const tutee = await Tutee.findByIdAndUpdate(req.params.tuteeId,{
            $set: req.body
        },{
            new: true
        });
        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json(tutee)
    } catch (err) {
        throw new Error(`Error updating tutee ${req.params.tuteeId}: ${err.message}`)
    }
    
};

const getTuteeSessions = async(req, res, next) => {
    try {
        const tutee = await Tutee.findById(req.params.tuteeId).populate('enrolledSessions');
        const tuteeSessions = tutee.enrolledSessions
    
        res.status(200).json(tuteeSessions);
      } catch (error) {
        res.status(500).json({ message: `Error retrieving sessions for: ${tutee.tuteeName}`, error });
      }
}

const enroll = async(req, res, next) => {
    try {
        const tutee = await Tutee.findById(req.params.tuteeId);
        const session = await Session.findById(req.params.sessionId);
        const index = session.tuteesEnrolled.indexOf(tutee._id);
        if(index !== -1){
            session.tuteesEnrolled.splice(index, 1);
            await Tutee.updateOne({ _id: tutee._id }, { $pull: { sessions: session._id } });
        }else{
        const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const message_body = `You have a class in ${session.subject} at ${session.startTime}`
        const sendTo = tutee.phoneNumber
        const reminderTime = new Date(session.startTime);
        reminderTime.setHours(reminderTime.getHours() - 1);
        client.messages.create({
            body: message_body,
            to: sendTo,
            from: process.env.TWILIO_FROM,
            schedule: reminderTime.toISOString()
        }).then((message) => console.log(message.sid));

        session.tuteesEnrolled.push(tutee._id);
        tutee.enrolledSessions.push(session._id);
    }
        await tutee.save();
        await session.save();
    
        res.status(200).json(session);
      } catch (error) {
        res.status(500).json({ message: 'Error enrolling tutee in session', error });
      }
    
}

// const unenroll = async(req,res,next) => {
//     try {
//         const tutee = await Tutee.findById(req.params.tuteeId);
//         const session = await Session.findById(req.params.sessionId);
//         const indexInTuteesEnrolled = session.tuteesEnrolled.indexOf(tutee._id)
//         const indexInEnrolledSessions = tutee.enrolledSessions.indexOf(session._id)
//         if(indexInTuteesEnrolled === -1) {
//             res
//                 .status(404)
//                 .setHeader('Content-Type', 'application/json')
//                 .json({success: false, msg: 'You are not enrolled in that class'})
//         } else{
//         session.tuteesEnrolled.splice(indexInTuteesEnrolled, 1);
//         tutee.enrolledSessions.splice(indexInEnrolledSessions, 1);

//         await session.save()
//         await tutee.save()
//         res
//             .status(200)
//             .setHeader('Content-Type', 'application/json')
//             .json({success:true, msg: 'Unenrolled successfully'})
//         }
//     } catch (err) {
//         throw new Error(`Error deleting sessions: ${err.message}`);
//     }
// }

module.exports = {
    getTutees,
    postTutee,
    deleteTutees,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    getTutee,
    deleteTutee,
    updateTutee,
    enroll,
    getTuteeSessions,
}
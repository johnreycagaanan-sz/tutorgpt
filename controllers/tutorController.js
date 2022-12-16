const Tutor = require('../models/Tutor');
const crypto = require('crypto');
const path = require('path');

const sendTokenResponse = (tutor, statusCode, res) => {
    const token = tutor.getSignedJwtToken();
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

    const tutor = await Tutor.findOne({userName}).select('+password')
    
    if(!tutor) throw new error ('Invalid credentials')

    const isMatch = await tutor.matchPassword(password);

    if(!isMatch) throw new Error('Invalid credentails')
    sendTokenResponse(tutor, 200, res)
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
    const tutor = await Tutor.findOne({userName: req.body.userName})

    if(!tutor) throw new Error('No tutor found');

    const resetToken = tutor.getResetPasswordToken();

    try {
        await tutor.save({ validateBeforeSave: false })
        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json({succes: true, msg: `Password has been reset with token: ${resetToken}`})
    } catch (err) {
        tutor.resetPasswordToken = undefined;
        tutor.resetPasswordExpire = undefined;

        await tutor.save({ validateBeforeSave: false })
        throw new Error(`Failed to save new password`)
    }
}

const resetPassword = async(req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.query.resetToken).digest('hex');
    console.log(resetPasswordToken)
    const tutor = await Tutor.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    

    if(!tutor) throw new Error('Invalid token');

    tutor.password = req.body.password;
    tutor.resetPasswordExpire = undefined;
    tutor.resetPasswordToken = undefined;

    await tutor.save();

    sendTokenResponse(tutor, 200, res)
}

const updatePassword = async(req, res, next) => {
    const tutor = await Tutor.findById(req.tutor.id).select('+password');

    const passwordMatches = await tutor.matchPassword(req.body.password);

    if(!passwordMatches) throw new Error('Password is incorrect');
    tutor.password = req.body.newPassword

    await tutor.save();
    sendTokenResponse(tutor, 200, res)
}

const getTutors = async(req, res, next) => {
    const filter = {};
    const options = {};
    if (Object.keys(req.body).length){
        const {
            subject,
            schedule,
            tutorName,
            limit,
            sortByAvailability
        } = req.query;
        
        if (subject) filter.subject = true;
        if (schedule) filter.schedule = true;
        if (tutorName) filter.tutorName = true;

        if (limit) options.limit = limit;
        if (sortByAvailability) options.sort = {
            availability: sortByAvailability === 'asc' ? 1: -1
        }

    }
    try {
        const tutors = await Tutor.find({}, filter, options);
        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json(tutors)
    } catch (err) {
        throw new Error(`Error retrieving artists: ${err.message}`);
    }
}

const postTutor = async(req, res, next) => {
    try {
        const tutor = await Tutor.create(req.body);
        res
            .status(201)
            .setHeader('Content-Type', 'application/json')
            .json(tutor)
    } catch (err) {
        throw new Error(`Error creating tutor: ${err.message}`);
    }
    
}

const deleteTutors = async (req, res, next) => {
    try {
        await Tutor.deleteMany();
        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json({success:true, msg: 'Tutors removed'})
    } catch (err) {
        throw new Error(`Error removing tutors: ${err.message}`);
    }
   
}

// const getArtist = async(req, res, next) => {
//     try {
//         const tutor = await Tutor.findById(req.params.artistId);
//         res
//             .status(200)
//             .setHeader('Content-Type', 'application/json')
//             .json(tutor)
//     } catch (err) {
//         throw new Error(`Error retrieving tutor ${req.params.artistId}: ${err.message}`);
//     }
    
// }

// const deleteArtist = async(req, res, next) => {
//     try {
//         await Tutor.findByIdAndDelete(req.params.artistId);
//         res
//             .status(200)
//             .setHeader('Content-Type', 'application/json')
//             .json({success:true, msg: `Deleting tutor: ${req.params.artistId}`})
//     } catch (err) {
//         throw new Error(`Error deleting tutor ${req.params.artistId}: ${err.message}`);
//     }
    
// }

// const updateArtist = async(req, res, next) => {
//     try {
//         const tutor = await Tutor.findByIdAndUpdate(req.params.artistId,{
//             $set: req.body
//         },{
//             new: true
//         });
//         res
//             .status(200)
//             .setHeader('Content-Type', 'application/json')
//             .json(tutor)
//     } catch (err) {
//         throw new Error(`Error updating tutor ${req.params.artistId}: ${err.message}`)
//     }
    
// };

// const postArtistImage = async (req, res ,next) => {
//         if(!req.files) throw new Error('Missing image!');

//         const file = req.files.file;

//         if(!file.mimetype.startsWith('image')) throw new Error('Please upload a image file type!');

//         if(file.size > process.env.MAX_FILE_SIZE) throw new Error(`Image exceeds size of ${process.env.MAX_FILE_SIZE}`);

//         file.name = `photo_${path.parse(file.name).ext}`;

//         const filePath = process.env.FILE_UPLOAD_PATH + file.name;

//         file.mv(filePath, async (err) => {
//         if(err) throw new Error(`Problem uploading photo: ${err.message}`);

//         await Tutor.findByIdAndUpdate(req.params.artistId, {image: file.name})
//         res
//         .status(200)
//         .setHeader('Content-Type', 'application/json')
//         .json({success: true, data: file.name})
//     })
// }


module.exports = {
    getTutors,
    postTutor,
    deleteTutors,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword
}
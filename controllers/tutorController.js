const Tutor = require('../models/Tutor');
const path = require('path');

const getTutors = async(req, res, next) => {
    const filter = {};
    const options = {};
    if (Object.keys(req.body).length){
        const {
            subject,
            schedule,
            tutorName
        } = req.query;
        
        if (subject) filter.subject = true;
        if (schedule) filter.schedule = true;
        if (tutorName) filter.tutorName = true;

        if (limit) options.limit = limit;
        if (sortByGenre) options.sort = {
            genre: sortByGenre === 'asc' ? 1: -1
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

// const deleteArtists = async (req, res, next) => {
//     try {
//         await Tutor.deleteMany();
//         res
//             .status(200)
//             .setHeader('Content-Type', 'application/json')
//             .json({success:true, msg: 'Artists deleted'})
//     } catch (err) {
//         throw new Error(`Error deleting artists: ${err.message}`);
//     }
   
// }

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
    postTutor
}
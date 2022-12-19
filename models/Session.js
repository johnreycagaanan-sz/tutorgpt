const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const TuteesEnrolled = new Schema({
//     tutee: {
//         type: Schema.Types.ObjectId,
//         ref: 'Tutee'
//     }     
// })

const SessionSchema = new Schema({
    tutorName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },
    enrolled:{
        type: Number,
        default: 0
    },
    startTime:{
        type: Date,
        required: true
    },
    endTime:{
        type: Date,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    tuteesEnrolled : [{
        type: Schema.Types.ObjectId,
        ref: 'Tutee'
    }]
},{
    timestamps: true
})


module.exports = mongoose.model('Session', SessionSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TuteesEnrolled = new Schema({
    tutee: {
        type: Schema.Types.ObjectId,
        ref: 'Tutee'
    }   
})

const SessionSchema = new Schema({
    tutorName: {
        type: String,
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
    tuteesEnrolled : [TuteesEnrolled]
},{
    timestamps: true
})


module.exports = mongoose.model('Session', SessionSchema);
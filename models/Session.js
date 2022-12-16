const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
},{
    timestamps: true
})


module.exports = mongoose.model('Session', SessionSchema);
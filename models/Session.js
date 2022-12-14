const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    tutorName:{
        type: String,
        required: [true, "Please enter tutorName"]
    },
    enrolled:{
        type: Number,
        default: 0
    },
    schedule:{
        type: String,
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
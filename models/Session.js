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
    rating:[RatingSchema]
},{
    timestamps: true
})

const RatingSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
        validate : rating => {
            return typeof rating === 'number';
        }
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutee'
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Session', SessionSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


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

const TutorSchema = new Schema({
    tutorName:{
        type: String,
        required: [true, "Please input your full name"],
        trim: true,
        maxlength: [50, 'Last name can not be more than 50 characters']
    },
    userName:{
        type: String,
        unique: true,
        required: true,
        maxLength: 20
    },
    password: {
        type: String,
        required: true,
        validate: (password) => {
            return validator.isStrongPassword(password);
        }
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: [true, "Email already exists"],
        validate: (email) => {
            return validator.isEmail(email);
        }
    },
    phoneNumber: {
        type: String,
        required: [true, "Please enter your phone number"],
        unique: [true, "Phone number already exists"]
    },
    age: {
        type: Number,
        required: true,
        validate: (age) => {
            return typeof age === 'number';
        }
    },
    gender: {
        type: String,
        required: [true, 'Please add a gender'],
        enum: [
            'Male',
            'Female'
        ]
    },
    subjects: {
        type: [String],
        required: [true, 'Please add your subjects'],
    },
    availability: [{
        day: String,
        startTime: String,
        endTime: String
    }],
    details: {
        type: String,
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpire:{
        type: Date
    },
    admin: {
        type: Boolean,
        default: false
    },
    ratings: [RatingSchema]
}, {
    timestamps: true
})

TutorSchema.pre('save', async function(next) {
    if(!this.isModified) next();

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
    
    next();
})

TutorSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRE
    })
}

TutorSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

TutorSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpire = Date.now() + 10 * 60 *1000

    return resetToken;
}



module.exports = mongoose.model('Tutor', TutorSchema);
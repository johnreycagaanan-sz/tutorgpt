const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TuteeSchema = new Schema({
    tuteeName:{
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
    details: {
        type: String,
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpire:{
        type: Date
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Tutee', TuteeSchema);
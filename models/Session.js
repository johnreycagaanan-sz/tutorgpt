const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Tutee = require('./Tutee');


const SessionSchema = new Schema({
    tutorName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },
    startTime:{
        type: String,
        required: true
    },
    endTime:{
        type: String,
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

SessionSchema.pre('remove', async function(next) {
    const tutees = this.tuteesEnrolled;
    for (let i = 0; i < tutees.length; i++) {
      const tutee = await Tutee.findById(tutees[i]);
      const sessionIndex = tutee.enrolledSessions.indexOf(this._id);
      if (sessionIndex > -1) {
        tutee.enrolledSessions.splice(sessionIndex, 1);
        await tutee.save();
      }
    }
    next();
  });

module.exports = mongoose.model('Session', SessionSchema);
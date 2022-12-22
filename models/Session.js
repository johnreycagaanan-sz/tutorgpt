const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Tutee = require('./Tutee')
const Tutor = require('./Tutor')


const SessionSchema = new Schema({
    tutor: {
        type: Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
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

  SessionSchema.post('save', async function(next) {
    const tutor = await Tutor.findById(this.tutor)
    tutor.tutorSessions.push(this._id)
    await tutor.save()
  });
module.exports = mongoose.model('Session', SessionSchema);
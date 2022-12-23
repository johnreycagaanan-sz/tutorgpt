# tutorgpt
> Backend for setting up an appointment for a tutorial service system

## Table of Contents
* [General Info](#general-info)
* [Technologies Used](#technologies-used)
* [Setup](#setup)
* [Features](#features)
* [Inspiration](#inspiration)
* [Contact](#contact)

## General Info

TutorGPT is a backend tool for tutors to sign up and add a tutorial session. Tutees can then also signup and enroll/unenroll
to that session

## Technologies Used
* Node.js - version 18.12.1
* Express - version 4.18.2
* express-mongo-sanitize - version 2.2.0
* dotenv - version 16.0.3
* jwt - version 8.5.1
* mongoose - version 6.8.0
* Bcrypt - version 5.1.0
* node-schedule - version 2.1.0
* twilio - version 3.84.0
* validator - version 0.1.1
* mongoose - version 6.8.0
* date-fns - version 2.29.3
* cors - version 2.8.5
* nodemon - version 2.0.20

## Setup
To try out this project:
1. Clone the GitHub repository locally to your computer
1. In the command line, navigate to the root directory of the repository, and type the following: 
  $ npm install 
1. Navigate to the client folder, and in the root directory of the client folder, type the following: 
  $ npm install 
1. In the client folder, and in the root directory of the client folder, type the following: 
  $ npm start
1. Navigate back to the root directory of this project "/GitConnect" and start the server by typing the following: 
  $ npx nodemon server (note that you must install the nodemon package first)
  
## Code Examples
```javascript
//to enroll /unenroll
//Route: POST/tutee/{tuteeId}/session/{sessionId}

const enroll = async(req, res, next) => {
    try {
        const tutee = await Tutee.findById(req.params.tuteeId);
        const session = await Session.findById(req.params.sessionId)
        const index = session.tuteesEnrolled.indexOf(tutee._id);
        
        if(index !== -1){
            session.tuteesEnrolled.splice(index, 1);
            await Tutee.updateOne({ _id: tutee._id }, { $pull: { sessions: session._id } });
            const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            const message_body = `You have unenrolled from class ${session.subject}`
            const sendTo = tutee.phoneNumber    
            client.messages.create({
            body: message_body,
            to: sendTo,
            from: process.env.TWILIO_FROM,
        }).then((message) => console.log(message.sid));
        }else{
        const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const message_body = `You have enrolled for a class in ${session.subject} at ${session.startTime}`
        const scheduled_message_body = `REMINDER:
        You have an upcoming class in
        ${session.subject} at 
        ${session.startTime}`
        const sendTo = tutee.phoneNumber
        const sendTime = new Date(session.startTime);
        sendTime.setHours(sendTime.getHours() - 1)

        client.messages.create({
            body: message_body,
            to: sendTo,
            from: process.env.TWILIO_FROM,
        }).then((message) => console.log(message.sid));

       const j = schedule.scheduleJob(sendTime, function() {
            client.messages.create({
              body: scheduled_message_body,
              from: process.env.TWILIO_FROM,
              to: sendTo
          })
          .then(message => console.log(message.sid))
          .done();
  });

        session.tuteesEnrolled.push(tutee._id);
        tutee.enrolledSessions.push(session._id);
    }
        await tutee.save();
        await session.save();
    
        res.status(200).json(session);
      } catch (error) {
        res.status(500).json(error.message);
      }
    
}
```
## Features
-A backend application using backend technologies like: MongoDB, Express, React, and Node.js
-Authorization and authentication implemented with JWT and Bcrypt
-Tutors and tutees can create accounts and login/logout
-Tutors can add sessions which includes the time and date as well as the subject
-Tutees will be sent an SMS notification when they enroll/unenroll to a subject
-Tutees will also be sent a reminder 1 hour before the schedule

## Status
The backend is finished and needs just the front end to be fully functional

## Inspiration
The inspiration for this is because I love teaching and I wanna make it more convenient by making a system that allows
the process to be done remotely

## Contact
Created by John Rey Caga-anan https://github.com/johnreycagaanan-sz
Feel free to contact me for any questions

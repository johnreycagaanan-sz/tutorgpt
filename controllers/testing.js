const twilio = require('twilio')
const dotenv = require('dotenv');
dotenv.config({ path: '../config/config.env'});
const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')
const schedule = require('node-schedule')


const sendTo2 = '+639061783380'
const sendTime = new Date('2022-12-23T08:45:00+0800')
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
console.log(sendTime)
const zonedDate = utcToZonedTime(sendTime, 'Asia/Kuala_Lumpur')
sendTime.setMinutes(zonedDate.getMinutes() - 60)
console.log(`new SendTime is: ${sendTime}`)
console.log(process.env.TWILIO_FROM)
console.log(process.env.TWILIO_ACCOUNT_SID)
console.log(process.env.TWILIO_AUTH_TOKEN)

client.messages
          .create({
              body: 'Hello, this is not a scheduled message!',
              from: process.env.TWILIO_FROM,
              to: sendTo2
          })
          .then(message => console.log(`${message.sid} ddd`))
          .done();

const j = schedule.scheduleJob(sendTime, function() {
    client.messages
          .create({
              body: 'Hello, this is a scheduled message!',
              from: process.env.TWILIO_FROM,
              to: sendTo2
          })
          .then(message => console.log(message.sid))
          .done();
  });
  
//   const k = schedule.scheduleJob(sendTime, function() {
//     client.messages
//           .create({
//               body: 'Hello, this is a scheduled message!',
//               from: process.env.TWILIO_FROM,
//               to: sendTo2
//           })
//           .then(message => console.log(message.sid))
//           .done();
//   });
//   k;
// const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//         const message_body = `hotdog ni nanay`
//         client.messages.create({
//             body: message_body,
//             to: sendTo2,
//             from: process.env.TWILIO_FROM,
//             schedule: '2022-12-21T13:35:00'
//         }).then((message) => console.log(message));
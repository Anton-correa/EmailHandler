const express = require("express"); 
const router = express.Router();
const mongoose = require("mongoose");
const EmailDB = require("../models/emails");
const validate = require('../validate.js')
const actions = require('../constants')

//Route to use for POST method to add emails to the database in mongodb using mongoose
router.post("/events", (req, res) => {
    
    const {subject, recipient, action} = req.query
    if(!validate.valRecipient(recipient) &&
    !validate.valSubject(subject) &&
    !validate.valAction(action)) {
      res.status(400);
      res.send('<h1>An invalid input was given</h1>');
      return
    }
  
    // save email
    const eventCreate = new EmailDB({
      action,
      subject,
      recipient,
    });
    eventCreate
      .save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  });

  //Routes to use to present the emails that are stored in the 
  //database and depending on the last parameter for filtering of the data
  //by recipient, action or timestamp
  router.get("/events", (req, res) => {
    EmailDB.find({ }).sort('recipient').lean()
    .then((data) => {
      res.render('emails', {emails: data, eventEmail: true})
    }).catch((err) => {
      res.json({message: err})
    })
  });
  
  router.get("/events/action/:actionType", (req, res) => {
    const action = req.params.actionType
    if(!validate.valAction(action) ){
      res.status(400)
      res.send('<h1>Wrong action type, the only acceptable actions are open or click</h1>');
      return
    }

    EmailDB.find({ 'action': action }).sort('recipient').lean()
    .then((data) => {
      res.render('emails', {emails: data, eventEmail: true})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  router.get("/events/recipient/:recipientName", (req, res) => {
    const recipient = req.params.recipientName
    if(!validate.valRecipient(recipient)) {
      res.status(400);
      res.send('<h1>This is not a valid email address format</h1>');
      return
    }
    EmailDB.find({ 'recipient': recipient }).sort('recipient').lean()
    .then((data) => {
      res.render('emails', {emails: data, eventEmail: true})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  router.get("/events/timestamp/:timestamp", (req, res) => {
    if(!validate.valTimestamp(req.params.timestamp)){
      res.status(400)
      res.send('<h1>Wrong format of timestamp</h1>');
      return
    }
    EmailDB.find({ 'timestamp': new Date(req.params.timestamp) }).lean()
    .then((data) => {
      res.render('emails', {emails: data, eventEmail: true})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  //Routes to use to present a summary of each recipient in the database with the count of open and click actions.
  router.get("/summary", (req, res) => {
    EmailDB.find({ }).sort('recipient').lean()
    .then((data) => {
      let recp = new Set()
      data.forEach(elem => {
        recp.add(elem.recipient)
      })
      const recipOpen = data.filter(x => x.action === actions.OPEN );
      const recipClick = data.filter(x => x.action === actions.CLICK );
      let emails = []
      recp.forEach(elem => {
         const newEmail = {
            recipient: elem,
            countOpen: recipOpen.filter(x => x.recipient === elem).length,
            countClick: recipClick.filter(x => x.recipient === elem).length
          }
          emails.push(newEmail)
      })
      res.render('emails', {emails: emails, summary: true})
    }).catch((err) => {
      res.json({message: err})
    })
    
  });

  router.get("/summary/:recipient", (req, res) => {
    if(!validate.valRecipient(req.params.recipient)){
      res.status(400);
      res.send('<h1>This is not a valid email address format</h1>');
      return
    }
    let countOpen, countClick = 0
    EmailDB.find({'recipient': req.params.recipient }).lean()
    .then((data) => {
      data.forEach(elem => {
        if (elem.action === actions.OPEN) {
          countOpen = countOpen + 1
        } 
        if(elem.action === actions.CLICK) {
          countClick = countClick + 1
        }
      });
      const emails = {recipient: req.params.recipient, countOpen: countOpen, countClick: countClick}
      res.render('emails', {emails: emails, summary: true})
    }).catch((err) => {
      res.json({message: err})
    })
    
  });

  router.get("/summary/startDate/:startDate/endDate/:endDate", (req, res) => {
    const startDate = new Date(req.params.startDate)
    const endDate = new Date(req.params.endDate)
    if(!validate.valTimestamp(startDate) || !validate.valTimestamp(endDate)){
      res.status(400)
      res.send('<h1>The timestamp field is empty or the format is incorrect, the format should be YYYY-mm-ddTHH:MM:ss</h1>');
      return
    }
    let countOpen, countClick = 0
    EmailDB.aggregate([ 
      {
        $match: {
          timestamp: { $gt: startDate, $lt: endDate },
        },
      }
    ]).then((data) => {
      countOpen = data.filter(x => x.action === actions.OPEN).length
      countClick = data.filter(x => x.action === actions.CLICK).length
      res.json({countClick, countOpen})
    });
  });

  module.exports = router;
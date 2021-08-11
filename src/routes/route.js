const express = require("express"); 
const router = express.Router();
const mongoose = require("mongoose");
const EmailDB = require("../models/emails");
const validator = require("validator");
const actions = require('../constants')
const validate = require('../validate')

router.post("/events", (req, res) => {
    
    const {subject, recipient, action} = req.query
    validate.valRecipient(recipient)
    validate.valSubject(subject)
    validate.valAction(action)
  
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
  
  router.get("/events/action/:actionType", (req, res) => {
    const action = req.params.actionType
    validate.valAction(action) 

    EmailDB.find({ 'action': action }).sort('recipient').lean()
    .then((data) => {
      res.render('emails', {emails: data, eventEmail: true})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  router.get("/events/recipient/:recipientName", (req, res) => {
    const recipient = req.params.recipientName
    validate.valRecipient(recipient)
    EmailDB.find({ 'recipient': recipient }).sort('recipient').lean()
    .then((data) => {
      res.render('emails', {emails: data, eventEmail: true})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  router.get("/events/timestamp/:timestamp", (req, res) => {
    validate.valTimestamp(req.params.timestamp)
    EmailDB.find({ 'timestamp': req.params.timestamp }).sort('recipient').lean()
    .then((data) => {
      res.render('emails', {emails: data, eventEmail: true})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  router.get("/summary/:recipient", (req, res) => {
    validate.valRecipient(req.params.recipient)
    var countOpen, countClick = 0
    EmailDB.find({'recipient': req.params.recipient }).lean()
    .then((data) => {
      data.forEach(elem => {
        if (elem.action === 'open') {
          countOpen = countOpen + 1
        } 
        if(elem.action === 'click') {
          countClick = countClick + 1
        }
      });
      var emails = {recipient: req.params.recipient, countOpen: countOpen, countClick: countClick}
      res.render('emails', {emails: emails, eventEmail: true})
    }).catch((err) => {
      res.json({message: err})
    })
    
  
  });

  router.get("/summary/startDate/:startDate/endDate/:endDate", (req, res) => {
    validate.valTimestamp(req.params.startDate)
    validate.valTimestamp(req.params.endDate)
    var countOpen, countClick = 0
    EmailDB.aggregate([ 
      {
        $match: {
          timestamp: { $gt: req.params.startDate, $lt: req.params.endDate },
        },
      }
    ]).then((data) => {
      countOpen = data.filter('open').length
      countClick = data.filter('click').length
      var emails = {countClick: countClick, countOpen: countOpen}
      res.render('emails', {emails: emails, summary: true})
    });
  });

  module.exports = router;
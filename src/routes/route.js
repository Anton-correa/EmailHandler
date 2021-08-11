const express = require("express"); 
const router = express.Router();
const mongoose = require("mongoose");
const EmailDB = require("../models/emails");
const validator = require("validator");
const actions = require('../constants')

router.post("/events", (req, res) => {
    //validation
    const {subject, recipient, action} = req.query
    if (validator.isEmpty(recipient) || !validator.isEmail(recipient)) { 
      res.status(400);
      res.send('<h1>This is not a valid email address format</h1>');
      return
    } 

    if (validator.isEmpty(subject)) { 
      res.status(400);
      res.send('<h1>The subject of the email is empty</h1>');
      return
    } 
  
    if (
      validator.isEmpty(action) || !validator.equals(action.toLowerCase(), actions.CLICK) ||
      !validator.equals(action.toLowerCase(), actions.OPEN)
    ) {
      res.status(400)
      res.send('<h1>Wrong action type, the only acceptable actions are open or click</h1>');
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
  
  router.get("/events/action/:actionType", (req, res) => {
    const action = req.params.actionType
    if (
      validator.isEmpty(action) || !validator.equals(action.toLowerCase(), actions.CLICK) ||
      !validator.equals(action.toLowerCase(), actions.OPEN)
    ) {
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
    if (validator.isEmpty(recipient) || !validator.isEmail(recipient)) { 
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
    EmailDB.find({ 'timestamp': req.params.timestamp }).sort('recipient').lean()
    .then((data) => {
      res.render('emails', {emails: data, eventEmail: true})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  router.get("/summary", (req, res) => {

    EmailDB.aggregate([ 
      {
        $group: {
          recipient: "$recipient",
          openActions: { $count: { $match: { action: actions.OPEN } } },
          clickActions: { $count: { $match: { action: actions.CLICK } } },
        },
      },
    ]).then((data) => {
      res.render('emails', {emails: data, summary: true})
    });
  
  });

  router.get("/summary/startDate/:startDate/endDate/:endDate", async (req, res) => {
    
    EmailDB.aggregate([ 
      {
        $match: {
          timestamp: { $gt: req.query.startDate, $lt: req.query.endDate },
        },
      },
      {
        $group: {
          recipient: "$recipient",
          openActions: { $count: { $match: { action: "open" } } },
          clickActions: { $count: { $match: { action: "click" } } },
        },
      },
    ]).then((data) => {
      res.render('emails', {emails: data, summary: true})
    });
  });

  module.exports = router;
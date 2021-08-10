const express = require("express"); 
const router = express.Router();
const mongoose = require("mongoose");
const EmailDB = require("../models/emails");
const validator = require("validator");

router.post("/events", async (req, res) => {
    //validation
    const subject = req.query.subject
    if (validator.isEmail(req.query.recipient)) { 
      recipient = req.query.recipient;
    } else {
      res.send('<h1>This is not a valid email address format</h1>');
    }
  
    if (
      validator.equals(req.query.action.toLowerCase(), "click") ||
      validator.equals(req.query.action.toLowerCase(), "open")
    ) {
      action = req.query.action;
    } else {
      res.send('<h1>Wrong action type, the only acceptable actions are open or click</h1>');
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
  
  router.get("/events/action/:actionType", async (req, res) => {
    
    EmailDB.find({ 'action': req.params.actionType }).sort('recipient').lean()
    .then((data) => {
      res.render('emails', {emails: data, eventEmail: true})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  router.get("/events/recipient/:recipientName", async (req, res) => {
    EmailDB.find({ 'recipient': req.params.recipientName }).sort('recipient').lean()
    .then((data) => {
      res.render('emails', {emails: data, eventEmail: true})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  router.get("/events/timestamp/:timestamp", async (req, res) => {
    EmailDB.find({ 'timestamp': req.params.timestamp }).sort('recipient').lean()
    .then((data) => {
      res.render('emails', {emails: data, eventEmail: true})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  router.get("/summary", async (req, res) => {

    EmailDB.aggregate([ 
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
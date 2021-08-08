const express = require("express"); 
const router = express.Router();
const mongoose = require("mongoose");
const EmailDB = require("../models/emails");

router.post("/events", async (req, res) => {
    //validation lib Yup
    const subject = req.query.subject
    if (req.query.recipient.includes('@')) {
      const recipient = req.query.recipient
    } else {
      res.status(400).send('<h3>The recipient is not an email</h3>')
    }
    if (req.query.action.toLowerCase() == 'open' || req.query.action.toLowerCase() == 'click') {
      const action = req.query.action
    } else {
      res.status(400).send('<h3>The action that is given is not the correct one, please use \'open\' or \'click\'</h3>')
    }
    // save email
    const eventCreate = new EmailDB({
      action: req.query.action.toLowerCase(),
      subject,
      recipient: req.query.recipient,
    });
    // try {
    //   const emailSave = await post.save();
    //   res.json(emailSave);
    // } catch (err) {
    //   res.json({ message: err });
    // }
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
      res.render('emails', {emails: data})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  router.get("/events/recipient/:recipientName", async (req, res) => {
    EmailDB.find({ 'recipient': req.params.recipientName }).sort('recipient').lean()
    .then((data) => {
      res.render('emails', {emails: data})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  router.get("/events/timestamp/:timestamp", async (req, res) => {
    EmailDB.find({ 'timestamp': req.params.timestamp }).sort('recipient').lean()
    .then((data) => {
      res.render('emails', {emails: data})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  router.get("/summary", async (req, res) => {
    let countOpen, countClick
    EmailDB.countDocuments({'recipient': req.params.recipient}).where('action').equals('open')
    .then((data) => {
      countOpen = data
    }).catch((err) => {
      res.json({ message: err})
    })
    EmailDB.countDocuments({'recipient': req.params.recipient}).where('action').equals('click')
    .then((data) => {
      countClick = data
    }).catch((err) => {
      res.json({ message: err})
    })
    EmailDB.find({ 'recipient': req.params.recipient }).lean()
    .then((data) => {
      res.render('emails', {emails: data})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  router.get("/summary/startDate/:startDate/endDate/:endDate", async (req, res) => {
    
    EmailDB.find({ 'action': req.params.actionType }).lean()
    .then((data) => {
      res.render('emails', {emails: data})
    }).catch((err) => {
      res.json({message: err})
    })
  });

  module.exports = router;
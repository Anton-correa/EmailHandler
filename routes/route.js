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
      action,
      subject: req.query.subject,
      recipient,
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
    res.send("hello world"+ req.params)
    console.log(req.params)
    try {
      const post = await EmailDB.find({ 'action': req.params.actionType })
      post.exec(function (err, result) {
        if (err) return handleError(err);
        res.render('emails', {emails: result})
      })
    } catch (err) {
      res.json({message: err})
    }
  });

  router.get("/events/recipient/:recipientName", async (req, res) => {
    res.send("hello world"+ req.params)
    console.log(req.params)
    // try {
    //   const post = await EmailDB.find({ 'recipient': req.params.recipient })
    //   post.exec(function (err, result) {
    //     if (err) return handleError(err);
    //     res.render('emails', {emails: result})
    //   })
    // } catch (err) {
    //   res.json({message: err})
    // }
  });

  router.get("/events/timestamp/:timestamp", async (req, res) => {
    res.send("hello world"+ req.params)
    console.log(req.params)
    // try {
    //   const post = await EmailDB.find({ 'recipient': req.params.recipient })
    //   post.exec(function (err, result) {
    //     if (err) return handleError(err);
    //     res.render('emails', {emails: result})
    //   })
    // } catch (err) {
    //   res.json({message: err})
    // }
  });

  router.get("/summary/recipient/:recipient", async (req, res) => {
    res.send("hello world"+ req.params)
    console.log(req.params)
    // try {
    //   const post = await EmailDB.find({ 'recipient': req.params.recipient })
    //   post.exec(function (err, result) {
    //     if (err) return handleError(err);
    //     res.render('emails', {emails: result})
    //   })
    // } catch (err) {
    //   res.json({message: err})
    // }
  });

  router.get("/summary/startDate/:startDate/endDate/:endDate", async (req, res) => {
    res.send("hello world"+ req.params)
    res.status(400).send("")
    console.log(req.params)
    // try {
    //   const post = await EmailDB.find({ 'recipient': req.params.recipient })
    //   post.exec(function (err, result) {
    //     if (err) return handleError(err);
    //     res.render('emails', {emails: result})
    //   })
    // } catch (err) {
    //   res.json({message: err})
    // }
  });

  module.exports = router;
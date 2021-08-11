const mongoose = require('mongoose');
const actions = require('../constants')
const EmailSchema = mongoose.Schema({
    action: {
        type: String,
        enum: [actions.OPEN, actions.CLICK],
        required: true
    },
    subject: String,
    recipient: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Email', EmailSchema);
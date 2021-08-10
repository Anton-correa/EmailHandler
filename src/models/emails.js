const mongoose = require('mongoose');
var actions = require('../constants')
const EmailSchema = mongoose.Schema({
    action: {
        type: String,
        enum: [actions.OPEN, actions.CLICK]
    },
    subject: String,
    recipient: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Email', EmailSchema);
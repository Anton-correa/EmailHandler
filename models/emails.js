const mongoose = require('mongoose');

const EmailSchema = mongoose.Schema({
    action: {
        type: String,
        enum: ['open', 'click']
    },
    subject: String,
    recipient: {
        type: String,
        match: ['@']
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Email', EmailSchema);
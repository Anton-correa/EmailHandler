const validator = require('validate')
const actions = require('../constants')
module.exports = {
    valRecipient: function(recipient) {
        if (validator.isEmpty(recipient) || !validator.isEmail(recipient)) { 
            res.status(400);
            res.send('<h1>This is not a valid email address format</h1>');
        }
    },

    valSubject: function(subject) {
        if (validator.isEmpty(subject)) { 
            res.status(400);
            res.send('<h1>The subject of the email is empty</h1>');
            return
        } 
    },

    valAction: function(action) {
        if (
            validator.isEmpty(action) || !validator.equals(action.toLowerCase(), actions.CLICK) ||
            !validator.equals(action.toLowerCase(), actions.OPEN)
          ) {
            res.status(400)
            res.send('<h1>Wrong action type, the only acceptable actions are open or click</h1>');
            return
          }
    },

    valTimestamp: function(timestamp) {
        if(validator.isISO8601(timestamp) || validator.isEmpty(timestamp)){
            res.status(400)
            res.send('<h1>The timestamp field is empty or the format is incorrect, the format should be YYYY-mm-ddTHH:MM:ss</h1>');
            return
        }
        
    }
}

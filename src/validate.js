const validator = require('validator')
const actions = require('./constants')
//These methods are for input validation in the parameters
module.exports = {
    valRecipient: function(recipient) {
        return (!validator.isEmpty(recipient) && validator.isEmail(recipient))  
    },

    valSubject: function(subject) {
        return (!validator.isEmpty(subject)) 
    },

    valAction: function(action) {
        return (
            !validator.isEmpty(action) && ((action.toLowerCase() === actions.CLICK) ||
            (action.toLowerCase() === actions.OPEN))
          ) 
    },

    valTimestamp: function(timestamp) {
        return(validator.isDate(timestamp) )
    }
}

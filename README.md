# EmailHandler 
EmailHandler is a web application that handles the user input from a url parameter to search or create emails using POST or GET, and the email information is stored in a mongoDB database.

# How it works
This application is currently live : https://email-handler117.herokuapp.com/

## Structure of the email
The email structure is as follows:
 - ID: this is a unique ID which is given to the item by the database and not entered by the user
 - Action: This is the action that the email executes which must be "open" or "click" depending on the user's input, and this field is REQUIRED 
 - Subject: This is what the email is about, and can be any text the user wants to enter
 - Recipient: This is the email address of the reciever of the email, and this field must be a valid email address and it is REQUIRED
 - Timestamp: This is the exact time when the email was created and this field is automatically added without user input

## Using method POST
For storing an email the application uses the POST action with the information entered in the url as shown in the example:

POST URL: ```localhost:3003/email/events```

## Using method GET
For getting the emails from the application using GET with the routes necessary for the search

### Getting emails by recipient
GET URL: ```localhost:3003/email/recipient/:recipient name```
Note: The end of the URL where ":recipient name" is written is where the user will write the email address of the recipient, which will be validaded in the application for any wrong written emails

Example: ```localhost:3003/email/recipient/bob@email.com```

### Getting emails by action
GET URL: ```localhost:3003/email/action/:action type```
Note: The end of the URL where ":action type" is written is where the user will write the action the user wants to search for, which will be validaded in the application for any invalid action that is not "open" or "click"

Example: ```localhost:3003/email/action/open```

### Getting emails by timestamp
GET URL: ```localhost:3003/email/timestamp/:timestamp```
Note: The end of the URL where ":timestamp" is written is where the user will write the date when the email was made, which will be validaded in the application for any invalid date format (YYYY-MM-ddTHH:mm:ss)

Example: ```localhost:3003/email/timestamp/2021-06-14T11:02:12```

### Getting summary of all emails
GET URL: ```localhost:3003/email/summary```
Note: This route will serve an entire list of all the emails stored in the database and demonstrate the amount of times it uses the open action and the click action filtered by recipient

### Getting summary of a single recipient
GET URL: ```localhost:3003/email/summary/:recipient name```
Note: This route will serve the amount of times it uses the open action and the click action by the designated recipient that is entered by the user in the ":recipient name" field

Example: ```localhost:3003/email/summary/bob@email.com```

### Getting summary by range of dates
```GET URL: localhost:3003/summary/startDate/:startDate/endDate/:endDate```
Note: In the URL where ":startDate" and ":endDate" is written is where the user will write the starting date and ending date of the range of emails that will be retrieved to demonstrate the amount of times each recipient appears with the open and the click action between those dates, and the dates will be validaded in the application for any invalid date format (YYYY-mm-ddTHH:mm:ss)

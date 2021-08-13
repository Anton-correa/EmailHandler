const express = require("express"); 
const bodyparser = require("body-parser");
const exphandle = require("express-handlebars");
const router = express.Router();
const mongoose = require("mongoose");
require('dotenv').config()
const emailRoute = require('./routes/route')
const app = express();

//Initialization of the handlebars engine
app.engine(
  "hbs",
  exphandle({
    extname: ".hbs",
    defaultLayout: "emails",
  })
);
app.set("view engine", "hbs");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//Connection to database establishes
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("connected to DB")
);

//Access routes for the application function
app.use("/", router);
app.use('/email', emailRoute)


app.listen(3003, () => console.log("Starting server"));

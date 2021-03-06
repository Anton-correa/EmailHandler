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
app.get("/", (req, res) => {
  res.send("Email handler Server Running");
});
app.use('/email', emailRoute)

const port = process.env.PORT || 3003;
app.listen(port, () => console.log("Starting server"));

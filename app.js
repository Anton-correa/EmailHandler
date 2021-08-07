const express = require("express"); 
const bodyparser = require("body-parser");
const exphandle = require("express-handlebars");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv/config");
const emailRoute = require('./routes/route')
const app = express();

app.engine(
  "hbs",
  exphandle({
    extname: ".hbs",
    layoutsDir: path.join(__dirname + "/views/layouts"),
    defaultLayout: "emails",
  })
);
app.set("view engine", "hbs");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("connected to DB")
);
app.use("/", router);
app.use('/email', emailRoute)


app.listen(3003, () => console.log("Starting server"));

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const keys = require("./config/keys");
// require("./models/User");
// require("./services/passport");

// mongoose.connect(keys.mongoURI);

// //route handler
// app.get("/", (req, res) => {
//   res.send("Hello Saida");
// });

// const PORT = process.env.PORT || 5000;

// // tells express to tell node that it wants to listen for incoming traffic 5000
// app.listen(PORT);

const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");

// order of require user Model Schema and require passport matters.
// schema needs to be required first so it can be used in passport.js
require("./models/User");
// require("./models/Survey");
require("./services/passport");

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, //30days
    keys: [keys.cookieKey]
  })
);

app.get("/", (req, res) => {
  res.send("Hello Saida Diperi");
});
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
// require("./routes/billingRoutes")(app);
// require("./routes/surveyRoutes")(app);

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static("client/build"));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);

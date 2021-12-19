const express = require("express");
const cors = require("cors");
const app = express();
const passport = require('passport')
const bodyParser = require('body-parser')

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
require('./serverApi/config/passport')(passport);

const db = require("./serverApi/models");

db.sequelize.sync();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

require("./serverApi/routes/answer.router")(app);
require("./serverApi/routes/image.router")(app);
require("./serverApi/routes/question.router")(app);
require("./serverApi/routes/quiz.router")(app);
require("./serverApi/routes/textAnswer.router")(app);
require("./serverApi/routes/user.router")(app);
require("./serverApi/routes/type.router")(app);
require('./serverApi/config/passport.js')(passport, db.users);

require("./serverApi/controllers/type.controller").create(
  {
    body: {
      name: "answer"
    }
  }, null);

  require("./serverApi/controllers/type.controller").create(
    {
      body: {
        name: "textanswer"
      }
    }, null);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
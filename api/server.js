const express = require('express')
const cors = require('cors')
const passport = require('passport')
const bodyParser = require('body-parser')
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const corsOptions = {
  origin: 'http://localhost:8081'
}

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "WebQuizzes API",
			version: "1.0.0",
			description: "WebQuizzes API",
		},
		servers: [
			{
				url: "http://localhost:8080/api",
			},
		]
	},
	
	components: {
		securitySchemes: {
		  jwt: {
			type: "http",
			scheme: "bearer",
			in: "header",
			bearerFormat: "JWT"
		  },
		}
	  }
	  ,
	  security: [{
		jwt: []
	  }],

	swagger: "2.0",

	apis: ["./ServerApi/routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express()
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.use(passport.initialize())
require('./serverApi/config/passport')(passport)

const db = require('./serverApi/models')

db.sequelize.sync()

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to application.' })
})

require('./serverApi/routes/answer.router')(app)
require('./serverApi/routes/image.router')(app)
require('./serverApi/routes/question.router')(app)
require('./serverApi/routes/quiz.router')(app)
require('./serverApi/routes/textAnswer.router')(app)
require('./serverApi/routes/user.router')(app)
require('./serverApi/routes/type.router')(app)
require('./serverApi/config/passport.js')(passport, db.users)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

require('./serverApi/controllers/type.controller').create(
  {
    body: {
      name: 'answer'
    }
  }, null)

require('./serverApi/controllers/type.controller').create(
  {
    body: {
      name: 'textanswer'
    }
  }, null)

module.exports.app = app

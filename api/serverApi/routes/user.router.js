module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  router.post("/users", users.create);

  router.get("/users/:id", users.findById);

  app.use("/api", router);
};
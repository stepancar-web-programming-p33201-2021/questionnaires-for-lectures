module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  router.get("/users/:login", users.findByLogin);

  router.post("/users", users.create);

  router.put("/users/:login", users.updateByLogin);

  router.delete("/users", users.deleteByLogin);

  app.use("/api", router);
};
module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  router.get("/users/:id", users.findById);

  router.post("/users", users.create);

  router.put("/users", users.updateById);

  router.delete("/users", users.deleteById);

  app.use("/api", router);
};
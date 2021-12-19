passport = require("passport");

module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  router.get("/users/page/:login", users.findByLogin);

  router.get("/users", 
  passport.authenticate('jwt', { 
    session: false 
  }),
  users.findAuthenticated);

  router.post("/users", users.create);

  router.post('/users/login', users.login);

  //router.put("/users/:login", users.updateByLogin);

  router.delete("/users", 
  passport.authenticate('jwt', { 
    session: false 
  }),
  users.delete);

  app.use("/api", router);
};
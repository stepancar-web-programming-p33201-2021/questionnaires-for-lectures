export default app => {
  const users = require("../controllers/user.controller.js");

  app.post("/users", users.create);

  app.get("/users/quizzes", users.findAllQuizzesByUserId);
};
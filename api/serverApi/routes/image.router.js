module.exports = app => {
    const images = require("../controllers/image.controller.js");
  
    var router = require("express").Router();
  
    router.get("/images/:id", images.findById);
  
    router.post("/images", images.create);
  
    router.put("/images/:id", images.updateById);
  
    router.delete("/images/:id", images.deleteById);
    
    app.use("/api", router);
  }
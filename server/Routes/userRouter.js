const userController = require("../Controllers/userController");
const authUserMiddleware = require("../Middleware/authUserMiddleware");
const router=require("express").Router();

router.post("/register",userController.register);
// router.post("/activation",userController.emailActivation);
// router.post("/login",userController.login);
// router.get("/refresh_token",userController.getAccessToken);
// router.post("/forgot",userController.forgotPassword);
// router.post("/reset",authUserMiddleware,userController.resetPassword);

module.exports=router
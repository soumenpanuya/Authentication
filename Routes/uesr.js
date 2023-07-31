const express = require('express');

const  router = express.Router();
const userController =require('../controller/user');

router.post("/registation",userController.userResistation);
router.post("/login",userController.userLogin);


module.exports =router;
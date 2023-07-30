const express = require('express');

const  router = express.Router();
const userController =require('../controller/user');

router.post("/registation",userController.userResistation);


module.exports =router;
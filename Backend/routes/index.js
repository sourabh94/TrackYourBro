const express = require('express');
const router = express.Router();

const path = {root:'public/'};


router.get('/', (req,res) => {
  res.sendFile('login.html',path);
});



module.exports = router;

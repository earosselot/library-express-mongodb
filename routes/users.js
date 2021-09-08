var express = require('express');
var router = express.Router();

router.get('/cool', (req, res, next) => {
  res.send("You're so cool");
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

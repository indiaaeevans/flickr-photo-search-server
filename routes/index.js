var express = require('express');
var router = express.Router();

const farmId = '4';
const serverId = '3229';
const id = '3065077027';
const secret  = '046d82cfc1';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

module.exports = router;
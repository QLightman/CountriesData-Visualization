var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
console.log("jello")
var listt = [2, 3, 4];
module.exports = router;
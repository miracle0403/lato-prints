var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LATOLAK PRINTS' });
});

//get error page. */
router.get('/404', function(req, res, next) {
  res.status(404).render('404', { title: 'PAGE NOT FOUND' });
});

//redirect 404 page. */
router.get('*', function(req, res, next) {
  res.redirect('/404');
});

module.exports = router;
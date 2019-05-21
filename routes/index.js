var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LATOLAK PRINTS' });
});

//get the art page
router.get('/art-design', function(req, res, next) {
  res.render('art-design', { title: 'LATOLAK PRINTS', sub: 'ART DESIGN' });
});

//products
router.get('/products', function(req, res, next) {
  res.render('products', { title: 'LATOLAK PRINTS', sub: 'OUR PRODUCTS' });
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
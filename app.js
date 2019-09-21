'use strict'
var createError = require('http-errors');
var helmet = require( 'helmet' );
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var hbs = require('express-handlebars');
var fs = require('fs');
var helmet = require('helmet');
var tables = require('./tables.js');
var expressValidator = require('express-validator');
var sql = require('mysql');
//var formidable = require('formidable');

var passport = require('passport');
var localStrategy = require('passport-local'),Strategy;
var session = require('express-session');
var SQLStore = require ('express-mysql-session')(session) 
var flash = require('express-flash-messages');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//middlewares
app.use( helmet( ));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var options = {
  waitForConnections: true,
  connectionLimit : 100,
  host: "localhost",
  user: "root",
  //password: 'ifeysamuel',
  database: "lato-prints"
};

//app.use(myConnection(sql, options, 'pool')); 

var sessionStore = new SQLStore(options);

app.use(session({
  secret: 'fbmdhmdfishjdj',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  name: 'lato' || 'lato-prints',
  /**cookie:
    #secure: true**/
  }));
  
 //passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(function(req, res, next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next(); 
});

  
app.use('/', indexRouter);
app.use('/users', usersRouter);

passport.use(new localStrategy(function(username, password, done){
    console.log(username);
    console.log(password);
	db.query('SELECT user_id, email, password FROM user WHERE username = ?', [username], function (err, results, fields){
		if (err) {done(err)};
		if (results.length === 0){
			console.log('false usename')
			done(null, false, {
				message: 'Invalid Username'
			});
		}else{
			var email = results[0].email;
			const hash = results[0].password.toString();
			bcrypt.compare(password, hash, function(err, response){
				if (response === true){
					console.log('good details')
					return done(null, {user_id: results[0].user_id});
				}else{
					console.log('false password')
					return done(null, false,{
						message:'Invalid Password'
					});
				}
			});
		}
	});
}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
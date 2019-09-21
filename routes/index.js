var express = require('express');
var router = express.Router();
var ensureLoggedIn =  require('connect-ensure-login').ensureLoggedIn
var util = require('util');
var fs = require('fs');
var passport = require('passport');
var db = require('../db.js'); 
var bcrypt = require('bcrypt-nodejs');
var url = require('url'); 
var math = require( 'mathjs' );

/* GET home page. */
router.get('/', function(req, res, next) {
	db.query('SELECT * FROM latest_products LIMIT 3 DESC', function(err, results, fields){
		if(err) throw err;
		var latest_products = results;
		res.render('index', { title: 'LATOLAK PRINTS', latest_products: latest_products});
	});
});

//get the video
router.get('/videos', function(req, res, next) {
	db.query('SELECT * FROM videos', function(err, results, fields){
		if(err) throw err;
		var videos = results;
		res.render('videos', { title: 'LATOLAK PRINTS', sub: 'VIDEOS', videos: videos });
	});
});


//get the art page
router.get('/art-design', function(req, res, next) {
  res.render('art-design', { title: 'LATOLAK PRINTS', sub: 'ART DESIGN' });
});

//products
router.get('/products', function(req, res, next) {
  res.render('products', { title: 'LATOLAK PRINTS', sub: 'OUR PRODUCTS' });
});

//admin page
router.get('/admin', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT user FROM admin WHERE user = ?', [currentUser], function(err, results, fields){
		if (err) throw err;
		if(results.length === 0){
			res.redirect('/404');
		}else{
			//video check
			db.query('SELECT title FROM videos', function(err, results, fields){
				if (err) throw err;
				var videos = results;
				db.query('SELECT title FROM latest_products', function(err, results, fields){
					if (err) throw err;
					var images = results;
					
					var flashMessages = res.locals.getMessages();
					if( flashMessages.adderror ){
						res.render( 'admin', {
							title: 'ADMIN CORNER',
							imagetitle:	images,
							videotitle: videos,
							showErrors: true,
							errors: flashMessages.adderror
						});
					}else{
						if( flashMessages.addsuccess ){
							res.render( 'admin', {
								title: 'ADMIN CORNER',
								showSuccess: true,
								imagetitle:	images,
								videotitle: videos,
								success: flashMessages.addsuccess
							});
						}else{
							if( flashMessages.delsuccess ){
								res.render( 'admin', {
									title: 'ADMIN CORNER',
									showSuccess: true,
									imagetitle:	images,
									videotitle: videos,
									success: flashMessages.delsuccess
								});
							}else{
								if( flashMessages.adminerror ){
									res.render( 'admin', {
										title: 'ADMIN CORNER',
										imagetitle:	images,
										videotitle: videos,
										showErrors: true,
										errors: flashMessages.adminerror
									});
								}else{
									if( flashMessages.removeimagesuccess ){
										res.render( 'admin', {
											title: 'ADMIN CORNER',
											showSuccess: true,
											imagetitle:	images,
											videotitle: videos,
											success: flashMessages.removeimagesuccess
										});
									}else{
										if( flashMessages.removevideosuccess ){
											res.render( 'admin', {
												title: 'ADMIN CORNER',
												showSuccess: true,
												imagetitle:	images,
												videotitle: videos,
												success: flashMessages.removevideosuccess
											});
										}else{
											if( flashMessages.passwordsuccess ){
												res.render( 'admin', {
													title: 'ADMIN CORNER',
													showSuccess: true,
													imagetitle:	images,
													videotitle: videos,
													success: flashMessages.passwordsuccess
												});
											}else{
												if( flashMessages.emailsuccess ){
													res.render( 'admin', {
														title: 'ADMIN CORNER',
														showSuccess: true,
														imagetitle:	images,
														videotitle: videos,
														success: flashMessages.emailsuccess
													});
												}else{
													if( flashMessages.emailerror ){
														res.render( 'admin', {
															title: 'ADMIN CORNER',
															imagetitle:	images,
															videotitle: videos,
															showErrors: true,
															errors: flashMessages.emailerror
														});
													}else{
														if( flashMessages.videoerror ){
															res.render( 'admin', {
																title: 'ADMIN CORNER',
																imagetitle:	images,
																videotitle: videos,
																showErrors: true,
																errors: flashMessages.videoerror
															});
														}else{
															if( flashMessages.videosuccess ){
																res.render( 'admin', {
																	title: 'ADMIN CORNER',
																	showSuccess: true,
																	imagetitle:	images,
																	videotitle: videos,
																	success: flashMessages.videosuccess
																});
															}else{
																if( flashMessages.imagesuccess ){
																	res.render( 'admin', {
																		title: 'ADMIN CORNER',
																		showSuccess: true,
																		imagetitle:	images,
																		videotitle: videos,
																		success: flashMessages.imagesuccess
																	});
																}else{
																	res.render( 'admin', {
																		title: 'ADMIN CORNER',
																		imagetitle:	images,
																		videotitle: videos
																	});
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}):
			});
		}		
	}):
});

//register get request
router.get('/register', function(req, res, next) {	
    res.render('register',  { title: 'REGISTRATION'});
});

//get logout
router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

//get login
router.get('/login', function(req, res, next) {  
	const flashMessages = res.locals.getMessages( );
	if( flashMessages.error ){
		res.render( 'login', {
			title: 'LOGIN',
			showErrors: true,
			errors: flashMessages.error
		});
	}else{
		res.render('login', { title: 'LOG IN'});
	}
});

//Passport login
passport.serializeUser(function(user_id, done){
  done(null, user_id)
});
        
passport.deserializeUser(function(user_id, done){
  done(null, user_id)
});

//post the register
router.post('/register', function (req, res, next) {
	req.checkBody('username', 'Username must be between 8 to 25 characters').len(8,25);
	req.checkBody('fullname', 'Full Name must be between 8 to 25 characters').len(8,25);
	req.checkBody('pass1', 'Password must be between 8 to 25 characters').len(8,100);
	req.checkBody('pass2', 'Password confirmation must be between 8 to 100 characters').len(8,100);
	req.checkBody('email', 'Email must be between 8 to 105 characters').len(8,105);
	req.checkBody('email', 'Invalid Email').isEmail();
	req.checkBody('code', 'Country Code must not be empty.').notEmpty();
	req.checkBody('pass1', 'Password must match').equals(req.body.pass2);
	req.checkBody('phone', 'Phone Number must be ten characters').len(10);
  
	var username = req.body.username;
	var password = req.body.pass1;
	var cpass = req.body.pass2;
	var email = req.body.email;
	var fullname = req.body.fullname;
	var code = req.body.code;
	var phone = req.body.phone;

	var errors = req.validationErrors();
	if (errors) { 
	
		console.log(JSON.stringify(errors));
  
		res.render('register', { title: 'REGISTRATION FAILED', errors: errors, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code, sponsor: sponsor});
	}else{
		db.query('SELECT username FROM user WHERE username = ?', [username], function(err, results, fields){
          	if (err) throw err;
			
          	if(results.length===1){
          		var error = "Sorry, this username is taken";
				console.log(error);
				res.render('register', {title: "REGISTRATION FAILED", error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code,  sponsor: sponsor});
          	}else{
				//check the email
				db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
          			if (err) throw err;
          			if(results.length===1){
          				var error = "Sorry, this email is taken";
            			console.log(error);
						res.render('register', {title: "REGISTRATION FAILED", error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code,  sponsor: sponsor});
            		}else{
						bcrypt.hash(password, saltRounds, null, function(err, hash){
							db.query( 'INSERT INTO user (full_name, phone, username, email, code, password) VALUES(?,  ?, ?, ?, ?, ?)', [ fullname, phone, username, email, code, hash], function(err, result, fields){
								if (err) throw err;
								var success = 'Successful registration';
								res.render('register', {title: 'REGISTRATION SUCCESSFUL!', success: success});
							});
						});
					}
				});
			}
		});
	}
});


//post log in
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successReturnToOrRedirect: '/admin',
  failureFlash: true
}));

//add new admin
router.post('/addadmin', function (req, res, next) {
	var user = req.body.user;
	db.query('SELECT user_id, username FROM user WHERE user_id = ?', [user], function(err, results, fields){
		if( err ) throw err;
		if ( results.length === 0){
			var error = 'Sorry this user does not exist.';
			req.flash('adderror', error);
			res.redirect('/admin/#addadmin');
		}
		else{
			db.query('SELECT user FROM admin WHERE user = ?', [user], function(err, results, fields){
				if( err ) throw err;
				if( results.length === 0 ){
					db.query('INSERT INTO admin ( user ) values( ? )', [user], function(err, results, fields){
						if( err ) throw err;
						var success = 'New Admin Added Successfully!';
						req.flash('addsuccess', success);
						res.redirect('/admin/#addadmin');
					});
				}
				if( results.length > 0 ){
					var error = 'This user is already an Admin';
					req.flash('adderror', error);
					res.redirect('/admin/#addadmin');
				} 
			});
		}
	});
});


//delete admin
router.post('/deladmin', function (req, res, next) {
	var user = req.body.user;
	db.query('SELECT user_id, username FROM user WHERE user_id = ?', [user], function(err, results, fields){
		if( err ) throw err;
		if ( results.length === 0){
			var error = 'Sorry this user does not exist.';
			req.flash('adminerror', error);
			res.redirect('/admin/#deladmin');
		}
		else{
			db.query('SELECT user FROM admin WHERE user = ?', [user], function(err, results, fields){
				if( err ) throw err;
				if( results.length === 0 ){
					var error = 'Sorry this admin does not exist.';
					req.flash('adminerror', error);
					res.redirect('/admin/#deladmin');
				}
				else {
					db.query('DELETE FROM admin WHERE user = ?', [user], function(err, results, fields){
						if( err ) throw err;
						var success = 'Admin deleted successfully!'
						req.flash('adminsuccess', success);
						res.redirect('/admin/#deladmin');
					});
				}
			});
		}
	});
});

//post the admin password
router.post('/changeadminpassword', function (req, res, next) {
	req.checkBody('password', 'Old Password must be between 8 to 25 characters').len(8,100);
	req.checkBody('newpassword', 'New Password confirmation must be between 8 to 100 characters').len(8,100);

	var errors = req.validationErrors();
	if (errors) { 
		res.render('admin', { title: 'PASSWORD CHANGE FAILED', errors: errors});
	}else{
		var currentUser = req.session.passport.user.user_id;
		var password = req.body.OldPassword;
		var newpassword = req.body.newpassword;
		
		bcrypt.hash(password, saltRounds, null, function(err, hash){
			db.query('UPDATE user SET password = ? WHERE user_id = ?', [newpassword, currentUser], function(err, results, fields){
				if( err ) throw err;
				var success = 'Password updated successfully!'
				req.flash('passwordsuccess', success);
				res.redirect('/admin/#password');
			});
		});
	}
});

//post the admin email
router.post('/changeadminemail', function (req, res, next) {
	req.checkBody('newemail', 'Email must be between 8 to 25 characters').len(8,100);
	req.checkBody('newemail', 'This field must be an email').isEmail();
	
	var errors = req.validationErrors();
	if (errors) { 
		res.render('admin', { title: 'EMAIL CHANGE FAILED', errors: errors});
	}else{
		var currentUser = req.session.passport.user.user_id;
		var email = req.body.newemail;
		
		db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
			if( err ) throw err;
			if (results.length > 0){
				var error = 'This email is already taken';
				req.flash('emailerror', error);
				res.redirect('/admin/#emailerror');
			}else{
				var success = 'Updated Successfully';
				req.flash('emailsuccess', success);
				res.redirect('/admin/#emailsuccess');
			}
		});
	}
}):

//post the video
router.post('/addvideo', function (req, res, next) {
	req.checkBody('link', 'Video link must be between 5 to 25 characters').len(5,100);
	req.checkBody('title', 'Video title must be between 8 to 25 characters').len(8,25);

	var errors = req.validationErrors();
	if (errors) { 
		res.render('admin', { title: 'FAILED ', errors: errors});
	}else{
		var description = req.body.description;
		var videolink = req.body.link;
		var videoTitle = req.body.title;
		
		db.query('INSERT INTO videos (title, link, description) VALUES (?, ?, ?)', [videoTitle, videolink, description],  function(err, results, fields){
			if( err ) throw err;
			var success = 'Video added';
			req.flash('videosuccess', success);
			res.redirect('/admin/#videosuccess');
		});
	}	
}):

//remove the video
router.post('/removevideo', function (req, res, next){
	var videoTitle = req.body.title;
	
	db.query('DELETE FROM videos WHERE title = ?', [videoTitle],  function(err, results, fields){
		if( err ) throw err;
		var success = 'Video Deleted!';
		req.flash('removevideosuccess', success);
		res.redirect('/admin/#removevideosuccess');
	});
});

//remove the video
router.post('/removeimage', function (req, res, next){
	var title = req.body.title;
	var did = path.join(__dirname + '');
	var rooti = did.split('/');
	var rooting = rooti.pop();
	var root = rooti.join('/');
	
	db.query( 'SELECT image FROM latest_products WHERE title  = ?', [title], function ( err, results, fields ){
		if (err) throw err;
		
		var imagepicture = results[0].image;
		var file = root + imagepicture;
		
		fs.unlink(file, function(err){
			if (err) throw err;
			db.query('DELETE FROM latest_products WHERE title = ?', [imagepicture],  function(err, results, fields){
				if( err ) throw err;
				var success = 'Image Deleted!';
				req.flash('removeimagesuccess', success);
				res.redirect('/admin/#removeimagesuccess');
			}):
		}):
	});
}

//post the image
router.post('/addimage', function (req, res, next) {
	if (req.url == '/addimage' && req.method.toLowerCase() == 'post'){
		var form = new formidable.IncomingForm();
		var did = path.join(__dirname + '');
		var rooti = did.split('/');
		var rooting = rooti.pop();
		var root = rooti.join('/');
		var source = '/public/img/products/';
		var dir = root + source;
		console.log(dir);
		
		form.uploadDir = dir;
		form.maxFileSize = 2 * 1024 * 1024;
		form.parse(req, function(err, fields, files){
			var title = fields.title;
			var description = fields.description;
			var getfiles = JSON.stringify( files );
			var file = JSON.parse( getfiles );
			var oldpath = file.img.path;
			var name = file.img.name;
			form.keepExtensions = true;
			var newpath = dir + name;
			var img = '/img/products/' + name;
			form.on('fileBegin', function( name, file){
				db.query( 'SELECT title FROM latest_products WHERE title  = ?', [title], function ( err, results, fields ){
					if (err) throw err;
					if(results.length > 0){
						fs.unlink(newpath, function(err){
							if (err) throw err;
							var error = 'Ooops! It seems ' + title + ' has been added already';
							req.flash('imageerror', error);
							res.redirect('/admin/#imageerror')
						});
					}else{
						//rename the file
						fs.rename(oldpath, newpath, function(err){
							if (err) throw err;
							//console.log('file renamed');
						});
						db.query('INSERT INTO latest_products (image, description, title) VALUES (?, ?, ?)', [img, description, title], function(err,results, fields){
							if (err)  throw err;
							var success =  'Image has been added successfully!';
							req.flash('imageuccess', success);
							res.redirect('/admin/#imagesuccess')
						}):
					}
				}):
			}
		}
	}
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
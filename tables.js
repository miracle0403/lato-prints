var db = require('./db.js');

db.query('CREATE TABLE IF NOT EXISTS videos (title VARCHAR(255) NOT NULL, description TEXT NOT NULL, link VARCHAR(255) NOT NULL, date_entered DATETIME DEFAULT CURRENT_TIMESTAMP)', function(err, results){
	if (err) throw err;
	console.log('video table created');
});

db.query('CREATE TABLE IF NOT EXISTS latest_products (title VARCHAR(255) NOT NULL, description TEXT NOT NULL, image VARCHAR(255) NOT NULL, date_entered DATETIME DEFAULT CURRENT_TIMESTAMP)', function(err, results){
	if (err) throw err;
	console.log('latest_products table created');
});

db.query('CREATE TABLE IF NOT EXISTS admin (user INT(11) NOT NULL, date_entered DATETIME DEFAULT CURRENT_TIESTAMP)', function(err, results){
	if (err) throw err;
	console.log('admin table created');
});

db.query('CREATE TABLE IF NOT EXISTS user (user INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL, username VARCHAR (255) UNIQUE NOT NULL, full_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, phone BIGINT(10) NOT NULL, date_entered DATETIME DEFAULT CURRENT_TIESTAMP)', function(err, results){
	if (err) throw err;
	console.log('user table created');
});
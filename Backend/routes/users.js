const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const db = require('../db');
const path = {root:'public/'};

//Home 

router.get('/home',authenticationMiddleware() ,(req,res) => {
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.sendFile('home.html', path);
});

//Login 

router.get('/login', (req,res) => {
  res.sendFile('login.html', path);
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/user/login' }),
  function(req, res) {
    res.redirect('/user/home');
});

//Register

router.get('/register', (req,res) => {
  res.sendFile('register.html', path);
});
// register validator
var registerValidator = [ 
	check('name','Username cannot be empty').not().isEmpty(),
	check('email','Enter valid email').isEmail(), 
	check('password','Password must be atleast 6 characters long').isLength({ min: 6 }),
	check('password2','Password must be atleast 6 characters long').isLength({ min: 6 }),
	check('password2', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)) ];

router.post('/register',registerValidator, (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var userType = 'client';
  var data = req.body;
  console.log(req.body);
  const { name, email, password, password2 } = req.body;

	bcrypt.hash(password, saltRounds, function(err, hash) {
  		db.query('insert into users (username,email,password,type) values (?,?,?,?)',[name,email,hash,userType], function(error,results,fields){
  			if (error) throw error;

  			db.query('select last_insert_id() as user_id',function(error,results,fields){
  				if (error) throw error;

  				const user_id = results[0];
  				console.log(user_id);
  				req.login(user_id,function(err){
  					res.send({msg:'success'});
  				});

  			});

  		});
	});

});
passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/user/login');
	}
}

module.exports = router;

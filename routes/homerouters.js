const { response } = require('express');


const express = require('express'),
      router  = express.Router(),
      session = require('express-session'),
      users    = require('../models/users').user,
      methodeoverride = require('method-override'),
      admin   = require('../models/users').admin;    



const dashboardRedirect = (req, res, next) => {

    if (req.session.username) {
        res.redirect('/dashboard');
    }else {
        next();
    }
}

const dashboardProtect = (req, res, next) => {
    if(!req.session.username){
        res.redirect('/login');
    }else {
        next();
    }  
}



router.get('/', dashboardRedirect, (req, res) =>{
    res.redirect('/login')
})

router.get('/dashboard', dashboardProtect, (req, res) => {
    const username = req.session.username;
    res.render('dashboard', {username, title: username})
});

router.get('/login', dashboardRedirect, (req, res) => {
    res.render('login', {title: 'user login', message: null});
})

router.get('/register', dashboardRedirect, (req, res) => {
    res.render('register', {title: 'Register User'})
});



router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    users.findOne({email: email, password: password}, (err, user) => {
        
        if (!user) {
            
            res.render('login', {message: "Invalid Email or Password"})
        } else {
            req.session.username = user.username;
            res.redirect('/dashboard');
        }
    })
})


router.post('/register', (req, res) => {
    const newUser = {
        id: Date.now().toString(),
        username: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    var newman = new users(newUser);
    newman.save();
    res.redirect('/login')
})

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('sid');
        res.redirect('/login')
    })
});







module.exports = router;
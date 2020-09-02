const express = require('express'),
      adminrout  = express.Router(),
      session = require('express-session'),
      users    = require('../models/users').user,
      methodeoverride = require('method-override'),
      admin   = require('../models/users').admin;



const adminDashboardRedirect = (req, res, next)=> {
    if (req.session.emailid) {
        res.redirect('/admin/adminDashboard')
    }else {
        next();
    }

}

const protectAdmin = (req, res, next) => {
    if(!req.session.emailid) {
        res.redirect('/admin/admin')
    }else {
        next();
    }
}

adminrout.get('/', adminDashboardRedirect, (req, res) => {
    res.redirect('/admin/admin');
});

adminrout.get('/admin', adminDashboardRedirect, (req, res) => {
    res.render('adminlogin', {title: 'Admin login',message: null});
});

adminrout.get('/adminDashboard', protectAdmin, (req, res) => {
    users.find({}).lean().exec((err, data) => {
        res.render('adminDashboard', {user: data})
    })
})

adminrout.post('/admin', (req, res) => {
    const {email, password} = admin;
    if(req.body.email === email && req.body.password === password){
        req.session.emailid = req.body.email;
        res.redirect('/admin/adminDashboard');
    }else {
       
        res.render('adminlogin',{message: "Invalid Email or Password"})
    }
})

adminrout.post('/useredit', (req, res) => {
    const id = req.body.id;
    console.log(users.id);
    users.findOne({ id: id }).lean()
        .exec((err, data) => {
            res.render('adminedit', { user: data });
            
        })
        

})

adminrout.put('/usereditsave', (req, res) => {
    
    const {id, email, username} = req.body;
    const data = {
        id, email, username
    }
    console.log(data);
    users.updateOne({id : id}, data, (err, docs) =>{
        console.log(users.id);
        if (err) throw err;
        res.redirect('/admin/adminDashboard')
    })
})

adminrout.post('/deleteuser', (req, res) => {
    const email = req.body.email;
    console.log(email)
    
    users.deleteOne({email: email}).exec((err, data) => {
        if(err) throw err;
        res.redirect("/admin/adminDashboard")
        
    })
})

adminrout.post('/adminlogout', (req, res) => {
    req.session.destroy();
    res.clearCookie('sid')
    res.redirect('/admin/admin')
})

module.exports = adminrout;
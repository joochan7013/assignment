const express = require('express');
const router = express.Router();
const content_ = require("../model/content");
const meals_ = require("../model/meals");

router.get('/', (req,res) =>{

    res.render("home",
    {
        title:"Live Fit Food",
        content: content_.getAllContent(),
        meal: meals_.getAllMeals(),
        best: meals_.getTopMeals()
    });
})

router.get('/mealspackage', (req,res) =>{

    res.render("mealspackage",
    {
        title: "Meals Package",
        meal: meals_.getAllMeals(),
        best: meals_.getTopMeals()
    });
})

router.get('/customer', (req,res) =>{

    res.render("customer",
    {
        title: "Customer Registration"
    });
})
router.post("/customer",(req,res)=>{

const {firstName,lastName,email} = req.body;
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: `${email}`,
  from: 'joochan7013@gmail.com',
  subject: 'Customer Registration',
  text: 'Successfully Registered',
  html: `<strong>Thank you for registering ${firstName} ${lastName}
  <br> Emali: ${email}</strong>`,
};

sgMail.send(msg)
    .then(()=> {
        res.redirect("/");
    })

    .catch(err => {
        console.log(`Error ${err}`);
    })

    const errors = [];
    const errors1 = [];
    const errors2 = [];
    const errors3 = [];
    const error_ =[];
    const errors4 = [];
    const errors5 = [];
    const error6 = [];
    const numalpha = /^[a-z][A-Z][0-9]$/;
    const emailvalid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    if(req.body.firstName=="")
    {
        errors.push("You Must Enter First Name");
    }
    if(req.body.lastName=="")
    {
        errors1.push("You Must Enter Last Name");
    }
    if(req.body.email=="")
    {
        errors2.push("You Must Enter an Email");
    }
    else if(emailvalid.test(req.body.email))
    {
        error_.push("Email isn't in right form");
    }
    if(req.body.password=="")
    {
        errors3.push("You Must Enter a Password");
    }
    else if(req.body.password.length < 6 || req.body.password.length > 17)
    {
        errors4.push("Password lenght has to be minimum 6 and maximum 16");
    }
    else if(!numalpha.test(req.body.password))
    {
        errors5.push("Password can only have numbers and alphabets")
    }

    if(req.body.password != req.body.password2)
    {
        error6.push("Not the same password");
    }

    if(errors.length>0){
        res.render("/customer",{
            title : "Customer Registration",
            errorMessage : errors
        });
        return;
    }
    else{
        res.redirect("/");
    }
    if(errors1.length>0){
        res.render("/customer",{
            title : "Customer Registration",
            errorMessage : errors1
        });
        return;
    }
    else{
        res.redirect("/");
    }
    if(errors2.length>0){
        res.render("/customer",{
            title : "Customer Registration",
            errorMessage : errors2
        });
        return;
    }
    else{
        res.redirect("/");
    }
    if(errors3.length>0){
        res.render("/customer",{
            title : "Customer Registration",
            errorMessage : errors3
        });
        return;
    }
    else{
        res.redirect("/");
    }
    if(error_.length>0){
        res.render("/customer",{
            title : "Customer Registration",
            errorMessage : error_
        });
        return;
    }
    else{
        res.redirect("/");
    }
    if(errors4.length>0){
        res.render("/customer",{
            title : "Customer Registration",
            errorMessage : errors4
        });
        return;
    }
    else{
        res.redirect("/");
    }
    if(errors5.length>0){
        res.render("/customer",{
            title : "Customer Registration",
            errorMessage : errors5
        });
        return;
    }
    else{
        res.redirect("/");
    }
    if(error6.length>0){
        res.render("/customer",{
            title : "Customer Registration",
            errorMessage : error6
        });
        return;
    }
    else{
        res.redirect("/");
    }
});
router.get('/login', (req,res) =>{

    res.render("login",
    {
        title: "Login Page"
    });
})
router.post('/login', (req,res) => {
    const error1 = [];
    const error2 = [];

    if(req.body.email == "")
    {
        error1.push ("Required Field");
    }

    if(req.body.password == "")
    {
        error2.push("Required Field");
    }

    if(error1.length > 0)
    {
        res.render('login' , {
            title: 'Login',
            errorMessages: error1
        });
        return;
    }

    else{
        res.redirect("/");
    }

    if(error2.length > 0)
    {
        res.render('login', {
            title: 'Login',
            errorMessages: error2
        });
        return;
    }

    else{
        res.redirect("/");
    }

});


module.exports = router;
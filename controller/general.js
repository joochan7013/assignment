const express = require('express');
const router = express.Router();
const content_ = require("../model/content");
const meals_ = require("../model/meals");
const user_ = require("../model/user");

const isAuthenticated = require("../middleware/authentication");

function isEmpty(object)
{
    for(let key in object)
    {
        if(object.hasOwnProperty(key)){
            return false;
        }
    }
    return true;
}

//home route
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

const {firstName,lastName,email, password, password2} = req.body;
const sgMail = require('@sendgrid/mail');
let error = {};
const numalpha = /^((?=.*[a-z])(?=.*[A-Z]))/;
const emailvalid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  

    if(firstName=="")
    {
        error.name ="You Must Enter First Name";
    }
    if(lastName=="")
    {
        error.lastname = "You Must Enter Last Name";
    }
    if(email=="")
    {
        error.email = "You Must Enter an Email";
    }
    else if(!emailvalid.test(email))
    {
        error.email ="Email isn't in right form";
    }
    if(password=="")
    {
        error.password = "You Must Enter a Password";
    }
    else if(password.length < 6 || password.length > 17)
    {
        error.password ="Password lenght has to be minimum 6 and maximum 16";
    }
    else if(!numalpha.test(password))
    {
        error.password ="Password must contain Upper and Lower";
    }

    if(password != password2)
    {
        error.password2 ="Not the same password";
    }

    if(isEmpty(error))
    {
        user_.findOne({email}).then(user=>{
            if(user == null)
            {
                const msg = {
                    to: `${email}`,
                    from: 'jkim551@myseneca.ca',
                    subject: 'Welcome to Live Fit Foods',
                    text: 'So Happy to See you Starting a Healthy Lifestyle',
                    html: `<strong>Hello ${firstName} ${lastName}, Nice to meet you!</strong>`,
                };
                const newUser = {
                    firstname: req.body.firstName,
                    lastname: req.body.lastName,
                    lemail: req.body.email,
                    lpassword: req.body.password
                };
                const newuser = new user_(newUser);
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                sgMail.send(msg)
                .then(
                    newuser.save()
                    .then(()=>{
                        res.render("dashboard",{
                            title: "Welcome",
                            name: `${newuser.firstname} ${newuser.lastname}`
                        });
                    })
                    .catch(err=> console.log(`Error while creating user: ${err}`))  
                )
                .catch(err=> console.log(`Error while creating user: ${err}`));
            }
            else{
                res.render("customer",{
                    title : "Customer Registration",
                    errorName: error.name,
                    errorLast: error.lastname,
                    errorEmail: error.email,
                    errorPass: error.password,
                    errorPass2: error.password2,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                    password2: req.body.password2
                });
            }
        })
    }
});
router.get('/login', (req,res) =>{

    res.render("login",
    {
        title: "Login Page"
    });
})
router.post('/login', (req,res) => {
    let error = {};
    const {email, password} = req.body;

    if(email == "")
    {
        error.email ="Required Field";
    }
    else if (email.search("@") == -1){
    
        errorMess.email = "Enter Email format";
    }
    if(password == "")
    {
        error.password = "Required Field";
    }

    if(isEmpty(error))
    {
        user_.findOne({"lemail": email})
        .then((user)=>{
            console.log(user);
            if(user == null){
                error.email = "Email not registered";
                res.render('login', {
                    title: 'Login',
                    error1: error.email,
                    error2: error.password,
                    email: req.body.email,
                    password: req.body.password
                });
            }
            else{
                if(password == user.lpassword)
                {
                    req.session.userInfo = user;
                    if(user.type == "user"){
                    res.render("welcome",
                         {
                            title: "Welcome",
                            name: `${user.firstname} ${user.lastname}`
                         });
                    console.log(req.session.userInfo);
                    }
                    else if (user.type == "admin"){
                        res.render("admin",
                         {
                            title: "Welcome",
                            name: `${user.firstname} ${user.lastname}`
                         });
                    }
                }
                else{
                        error.password = "Password Incorrect";
                         res.render('login', {
                        title: 'Login',
                         error1: error.email,
                        error2: error.password,
                        email: req.body.email,
                        password: req.body.password
                
                        });
                    }
                }
            })
        .catch(err => console.log(`Error occur when login ${err}`));
    }
    else
    {
        res.render('login', {
            title: 'Login',
            error1: error.email,
            error2: error.password,
            email: req.body.email,
            password: req.body.password
        });
    }
});
router.get("/logout", (req,res) => {
    req.session.reset();
    res.redirect("/login");
})


router.get('/admin',isAuthenticated, (req,res)=>{
    
    res.render("admin",
    {
        title: "Data Clerk",
    });
})

module.exports = router;
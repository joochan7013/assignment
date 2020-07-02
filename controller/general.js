const express = require('express');
const router = express.Router();
const content_ = require("../model/content");
const meals_ = require("../model/meals");

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
sgMail.setApiKey(process.env.SENDGRID_API_KEY);   

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
    const msg = {
        to: `${email}`,
        from: 'joochan7013@gmail.com',
        subject: 'Welcome to Live Fit Foods',
        text: 'So Happy to See you Starting a Healthy Lifestyle',
        html: `<strong>Hello ${firstName} ${lastName}, Nice to meet you!</strong>`,
};
    
    sgMail.send(msg)
    .then(()=>{
        res.redirect("/dashboard");
    })    
    .catch(err => {
        console.log(`Error ${err}`);
    })    
    }
    else
    {
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

    if(password == "")
    {
        error.password = "Required Field";
    }

    if(isEmpty(error))
    {
        res.redirect("/");
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

router.get('/dashboard', (req,res) =>{

    res.render("dashboard",
    {
        title: "Welcome New Member"
    });
})

module.exports = router;
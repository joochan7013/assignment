const express = require('express');
const router = express.Router();
const content_ = require("../model/content.js");
const user_ = require("../model/user.js");
const product = require("../model/product.js")
const path = require("path");
const multer = require('multer');


const storage = multer.diskStorage({
    destination: 'public',
    filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })

const upload = multer({storage: storage});

const isAuthen = require("../middleware/authentication");

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
    
    product.find()
    .then(top => {
        const topMeals = [];
        top.forEach(e =>{
            topMeals.push({
                id: e._id,
                title: e.title,
                price: e.price,
                category: e.category,
                synopsis: e.synopsis,
                noofmeals: e.noofmeals,
                best: e.best,
                image: e.image
            });
        });
        res.render("home",
    {
        title: "Live Fit Foods",
        content: content_.getAllContent(),
        meal: topMeals,
        best: topMeals
    });
    });
})

router.get('/mealspackage', (req,res) =>{

    product.find()
    .then(top => {
        const topMeals = [];
        top.forEach(e =>{
            topMeals.push({
                id: e._id,
                title: e.title,
                price: e.price,
                category: e.category,
                synopsis: e.synopsis,
                noofmeals: e.noofmeals,
                best: e.best,
                image: e.image
            });
        });
        res.render("mealspackage",
    {
        title: "Meals Package",
        meal: topMeals,
        best: topMeals
    });
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
const error = {};
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
    const error = {};
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
                    res.redirect("/welcome");
                    
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

router.get("/welcome", isAuthen, (req,res)=>{
    if(req.session.userInfo.type == "user")
    {
        res.render("welcome",
                         {
                            title: "Welcome",
                            name: `${req.session.userInfo.firstname} ${req.session.userInfo.lastname}`
                         });
                    console.log(req.session.userInfo);
    }
    else if(req.session.userInfo.type == "admin"){
        
       res.redirect("/admin");
    }
})

router.get("/admin", isAuthen, (req,res)=>{
    const filter = [];
        product.find()
        .then(meals =>{
            meals.forEach(e=>{
                filter.push({
                id: e._id,
                title: e.title,
                price: e.price,
                category: e.category,
                synopsis: e.synopsis,
                noofmeals: e.noofmeals,
                best: e.best,
                image: e.image
                });
            });
            res.render("admin",
                         {
                            title: "Data Clerk",
                            name: `${req.session.userInfo.firstname} ${req.session.userInfo.lastname}`,
                            data: filter
                         });
                    console.log(req.session.userInfo);
        });
})

router.get("/addMeal", isAuthen, (req,res)=>{
   
    res.render("addMeal",{
        title: "Add Meal"
    });
})
router.post("/addMeal", upload.single("image"), (req,res)=>{

        const error = {};
        const {title, price, category, noofmeals, best, synopsis} = req.body;
        req.body.image = req.file.filename;

        if(title =="")
            error.title = "Name is required";
        if(price =="")
            error.price = "Price is required";
        if(category == "")
            error.category = "Category is required";
        if(noofmeals == "")
            error.noofmeals = "Number of Meals required";
        if(synopsis == "")
            error.synopsis = "Description is required";
        if(req.body.image == "")
            error.image = "Image is required";
        
        if(isEmpty(error))
        {
            const newMeal = {
                title: title,
                price: price,
                synopsis: synopsis,
                image: req.body.image,
                best: best == null ? false : true,
                category: category,
                noofmeals: noofmeals
            };
            const newmeal = product(newMeal);
            console.log(newMeal);
            newmeal.save()
            .then(prod => {
                res.redirect('/admin');
            })
            .catch(err => console.log(err));
        }
        else{
            res.render('addMeal', {
                title: req.body.title,
                price: req.body.price,
                category: req.body.category,
                noofmeals: req.body.category,
                synopsis: req.body.synopsis,
                image: req.body.image
            });
        }
    }
)

router.get("/delete/:title",isAuthen, (req,res)=>{
    
    product.deleteOne({title: req.params.title})
    .exec()
    .then(()=>{
        res.redirect("/admin");
    })
    .catch(err=>{
        console.log(`Error Occured: ${err}`);
        res.redirect("/admin");
    })
})

router.get("/update/:title",isAuthen, (req,res)=>{

    product.findOne({title: req.params.title})
    .exec()
    .then(meal =>{
        const {price, synopsis, category, noofmeals, best} = meal;
        res.render("update", {
            title: req.params.title,
            price: price,
            synopsis: synopsis,
            best: best,
            category: category,
            noofmeals: noofmeals
        })
    })
    .catch(err=> console.log(err));
})

router.post("/update/:title", isAuthen, (req,res)=>{
    const {title,price, synopsis, category, noofmeals, best} = req.body;

    product.updateOne(
        {title: req.params.title},
        {$set: {
            price: price,
            synopsis: synopsis,
            category: category,
            noofmeals: noofmeals,
            best: best == null? false: true
        }})
        .exec()
        .then(()=>{
            res.redirect("/admin");
            console.log(`Meal ${req.params.title} has been updated`);
        })
        .catch(err => {
            console.log(`Error Occured: ${err}`)
            res.redirect("/update/:title")
        });
})

module.exports = router;
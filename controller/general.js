const express = require('express');
const router = express.Router();
const content_ = require("../model/content.js");
const user_ = require("../model/user.js");
const product = require("../model/product.js")
const cart = require("../model/cart.js");
const path = require("path");
const multer = require('multer');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');


const storage = multer.diskStorage({
    destination: 'public',
    filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })

const upload = multer({storage: storage});

const isAuthen = require("../middleware/authentication");
const e = require('express');
const { updateOne } = require('../model/user.js');

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

router.get("/description/:productId", (req,res)=>{

    const {quantity} = req.body;
    product.findById(req.params.productId)
    .then(meal =>{
        console.log(meal);
        let filter = new product(meal);
        filter.quantity = quantity;
        console.log(filter);
        res.render("description",{
            id: filter._id,
            title: filter.title,
                price: filter.price,
                synopsis: filter.synopsis,
                noofmeals: filter.noofmeals,
                image: filter.image,
        });
    })
    .catch(err=> console.log(err));
})

router.get('/customer', (req,res) =>{

    res.render("customer",
    {
        title: "Customer Registration"
    });
})
router.post("/customer",(req,res)=>{

const {firstName,lastName,email, password, password2} = req.body;
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
                bcrypt.genSalt(10, function(err, salt){
                    bcrypt.hash(req.body.password,salt, function(err,hash){
                        const newUser = new user_({
                            "firstname": req.body.firstName,
                            "lastname": req.body.lastName,
                            "lemail": req.body.email,
                            "lpassword": hash
                        });
                        newUser.save((err)=>{
                            if(err)
                            {
                                error.email = "Email already in use";
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
                            else{
                                console.log("Success! User Saved");
                            }
                            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                            const msg = {
                                to: `${email}`,
                                from: 'jkim551@myseneca.ca',
                                subject: 'Welcome to Live Fit Foods',
                                text: 'So Happy to See you Starting a Healthy Lifestyle',
                                html: `<strong>Hello ${firstName} ${lastName}, Nice to meet you!</strong>`,
                            };
                        sgMail.send(msg)
                         .then(()=>{
                        res.render("dashboard",{
                            title: "Welcome",
                            name: `${newUser.firstname} ${newUser.lastname}`
                        });
                    })
                    .catch(err=> console.log(`Error while creating user: ${err}`)); 
                    })
                })
                })
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

    if(req.session.userInfo){
        console.log("Already Logged In");
        res.redirect("/welcome");
    }
    else{
    res.render("login",
    {
        title: "Login Page"
    });
}
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
                bcrypt
                .compare(password, user.lpassword)
                .then(isMatched => {
                    if(isMatched){
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
                })
                .catch(err => console.log(`Error occur when login ${err}`));
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

router.get("/cart", isAuthen, (req,res)=>{
    cart.
    find({userId: req.session.userInfo._id})
    .then(carts =>{
        const filter = [];
            let t_price = 0;
        carts.forEach(async e =>{
            t_price += (e.price* e.quantity);
            filter.push({
                cartId: e._id,
                title: e.title,
                synopsis: e.synopsis,
                price: e.price,
                image: e.image,
                quantity: e.quantity,
            });
        });
        req.session.userInfo.total = t_price;
        res.render("cart",{
            title: `${req.session.userInfo.lastname}`,
            data: filter,
            total: t_price,
            userName: `${req.session.userInfo.lastname} ${req.session.userInfo.firstname}`
        })
    })
    .catch(err => console.log(`${err}`));
});

router.post("/cart/:productId", isAuthen, (req,res) =>{
    const {quantity} = req.body;
    product.findOne({_id: req.params.productId})
    .then(meal =>{
        cart.findOne({prodId: meal._id})
        .then(second =>{
            if(second == null){

                console.log(meal);
                console.log(quantity);
                const newItem = {
                    userId: req.session.userInfo._id,
                    prodId: meal._id,
                    title: meal.title,
                    synopsis: meal.synopsis,
                    noofmeals: meal.noofmeals,
                    price: meal.price,
                    image: meal.image,
                    quantity: quantity
                };
                console.log(newItem);
                Item = new cart(newItem);
                Item.save()
                .then(()=>{
                    res.redirect("/cart");
                })
                .catch(err => console.log(`${err}`));
            }
            else{
                console.log("Already EXISTS");
                res.redirect("/mealspackage");
            }
        })
        .catch(err => console.log(`${err}`));
        
    })
    .catch(err => console.log(`${err}`));
})

router.get("/delete/:id",(req,res) =>{
 cart.deleteOne({_id:req.params.id})
 .then(()=>{
     res.redirect("/cart");
 })
 .catch(err =>
    console.log(`Error:${err}`));

})
router.get("/pay", (req,res)=>{
    
    cart.find({userId: req.session.userInfo._id})
    .then(carts =>{
        const filter = [];
        carts.forEach(async e =>{
            filter.push({
                title: e.title,
                price: e.price,
            });
        });
    
    console.log(filter);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    let cartString = JSON.stringify(filter);
    const msg = {
        to: `${req.session.userInfo.lemail}`,
        from: 'jkim551@myseneca.ca',
        subject: 'Welcome to Live Fit Foods',
        text: 'So Happy to See you Starting a Healthy Lifestyle',
        html: `Order Details: ${cartString}<br><br><br> Total Price: ${req.session.userInfo.total}`,
    };
    sgMail.send(msg)
                         .then(()=>{
                            cart.deleteMany()
                            .then(()=>{
                                res.redirect("/");
                    })
                    .catch(err => console.log(`Error:${err}`));
                    })
                    .catch(err=> console.log(`Error while creating user: ${err}`));

})
.catch(err => console.log(`${err}`));

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
    const {price, synopsis, category, noofmeals, best} = req.body;

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
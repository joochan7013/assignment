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
router.get('/login', (req,res) =>{

    res.render("login",
    {
        title: "Login Page"
    });
})

module.exports = router;
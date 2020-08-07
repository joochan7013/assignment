const Admin =(req,res,next) =>{
    if(req.session.userInfo.type == "Admin"){
        res.redirect("user/admin");
    }
    else{
        res.redirect("/");
    }
};

module.exports = Admin;
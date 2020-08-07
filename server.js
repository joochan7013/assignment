const express = require("express");

require('dotenv').config({path:"./config/keys.env"});

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const exphbs = require("express-handlebars");
const bodyParser =require('body-parser');
const clientSessions = require("client-sessions");

const app = express();

//Tells express handle bars as its template engine
app.engine('handlebars',exphbs());
app.set('view engine', 'handlebars');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false}));

app.use(clientSessions({
    cookieName: "session", 
    secret: process.env.SECRET_KEY, 
    duration: 2 * 60 * 1000, 
    activeDuration: 1000 * 60 
  }));
  
  app.use((req, res, next) => {
    res.locals.user = req.session.userInfo;
    next();
  });

const generalcontrol = require("./controller/general");

app.use("/", generalcontrol);

const PORT =process.env.PORT;
app.listen(PORT,()=>
{
    console.log("Server is up and running at ", PORT);
})
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser =require('body-parser');

const app = express();

require('dotenv').config({path:"./config/keys.env"});

//Tells express handle bars as its template engine
app.engine('handlebars',exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));

const generalcontrol = require("./controller/general");

app.use("/", generalcontrol);

const PORT =process.env.PORT;
app.listen(PORT,()=>
{
    console.log("Server is up and running at ", PORT);
})
const express = require('express')
const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
var expressLayouts = require('express-ejs-layouts');
const routes = require('./routes');
const matchCredentials = require('./utils.js')
const fake_db=require("./fake_db")
const port=1612;
const app = express()

app.set('view engine', 'ejs')

const middlewares=[cookieParser(),express.urlencoded({extended: false}),express.static('public'),expressLayouts];

app.use(middlewares);

app.use('/', routes);

//app.use()

//Creat the server an allow it to run on Port number 1612.
app.listen(port,()=>{
  console.log(`Application Sever started and Running localhost:${port}`);
})

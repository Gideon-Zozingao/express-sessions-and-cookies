const express = require('express');

const router = express.Router();
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const matchCredentials = require('./utils.js')
const fake_db=require("./fake_db")

router.get('/',(req,res)=>{
  res.render('pages/home',{title:"Home",session:fake_db.sessions[req.cookies.SID]});
})

//create a user acount
router.post('/create',(req,res)=>{
  let body=req.body;
  if(body.username!==""&&body.password!==""){
    let user={
      username:body.username,
      password:body.password
    }
    fake_db.users[user.username]=user
    console.log(fake_db);
    res.redirect('/')
  }else{
  res.render('pages/errors',{title:"Error",err_message:"Registration was Not Successful, Required are fields Empty"})  
  }

})

//login
router.post('/login',(req,res)=>{
  if(matchCredentials(req.body)){
    let user=fake_db.users[req.body.username];
    let id=uuidv4();
    fake_db.sessions[id]={
      user:user,
      timeOfLogin:Date.now()
    }
    //created cookies that holds the UUID (session id)
res.cookie("SID",id,{expires:new Date(Date.now()+900000),httpOnly:true})
    console.log(fake_db.sessions[id].user.username);
    res.render("pages/members",{title:"Members Home",person:fake_db.users.username});
  }else{
    res.render("pages/errors",{title:"Error",err_message:"Invalid credentials"})
  }
})


router.get('/login',(req,res)=>{
res.render("pages/login",{title:"Login",session:fake_db.sessions[req.cookies.SID]});
})
router.get('/register',(req,res)=>{
res.render("pages/register",{title:"Create Account",session:fake_db.sessions[req.cookies.SID]});
})





router.get('/logout',(req,res)=>{
  let SID=req.cookies.SID;
  delete fake_db.sessions[SID];
  res.cookie("SID","",{expires:new Date(Date.now()-900000)})
  //console.log(SID);
  //res.cookie("SID","",{expires:0});
  res.redirect('/');
  console.log(fake_db.sessions);
})
//this is a protected homepage.
router.get('/profile',(req,res)=>{
let id=req.cookies.SID;
let session=fake_db.sessions[id];
//if session is undefined than this will be false
if(session){
  res.render('pages/members',{title:"Members Home",person:fake_db.sessions[id].user.username});

}else{
  res.render('pages/errors',{title:"Error",err_message:"You have  not loged in"});

}

})

//if something goes wrong,you get sent here
router.get('/errors',(req,res)=>{
  res.render('pages/errors',{title:"Error"});
})
//404 handling
router.get("*",(req,res)=>{
  res.render("pages/errors",{title:"Error",err_message:"404"});
})

module.exports=router

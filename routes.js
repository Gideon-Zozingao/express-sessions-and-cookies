const express = require('express');

const router = express.Router();
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const matchCredentials = require('./utils.js')
const fake_db=require("./fake_db")
router.get('/',(req,res)=>{
  res.render('pages/home');
})

//create a user acount
router.post('/create',(req,res)=>{
  let body=req.body;
  let user={
    username:body.username,
    password:body.password
  }
  fake_db.users[user.username]=user
  console.log(fake_db);
  res.redirect('/')
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
    res.render("pages/members",{login:true,person:fake_db.sessions[id].user.username});
  }else{
    res.render("pages/errors")
  }
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
router.get('/supercoolmembersonlypage',(req,res)=>{
let id=req.cookies.SID;
let session=fake_db.sessions[id];
//if session is undefined than this will be false
if(session){
  res.render('pages/members',{person:fake_db.sessions[id].user.username});

}else{
  res.render('pages/errors');

}

})

//if something goes wrong,you get sent here
router.get('/errors',(req,res)=>{
  res.render('pages/render');
})
//404 handling
router.get("*",(req,res)=>{
  res.render("pages/errors");
})

module.exports=router
const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
var productHelper = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(bodyParser.json()); 
app.use(cookieParser());
let cookieValue=""
var loginStatus;

app.get('/', function (req, res) {
  productHelper.viewProducts().then((products) => {
    res.send({products})
  })  
}) 
app.get('/user',(req,res)=>{
  let cookieId=req.cookies.mystore
  if(cookieId){ 
    userHelpers.getSession(cookieId).then((response)=>{
      if(response){
          let userDatas=response.sessionData
          productHelper.viewProducts().then((products) => {
            res.send({products,userDatas,status:true})
          })
        }else{
          res.send({status:false})
        }
      })
    } 
})
app.get('/viewoneproduct/:id', function (req, res) {
  if(req.cookies){
    console.log(req.cookies);
  }else{
    console.log("nothing"); 
  }
  var id = req.params.id;
  productHelper.viewOneProduct(id).then((response) => {
    console.log(response);
    res.send(response)
  })  
})
app.get('/uploads/:path', (req, res) => {
  res.download('./uploads/' + req.params.path)
})
app.post('/signup-submit',function (req, res) {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    res.send("success")
  })
  console.log(req.body);
})
app.post('/login-submit', function (req, res) {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      loginStatus=true;
      const userDatas = [
        response.status,
        response.user.name,
        response.user.phone,
        response.user._id
      ]
      setTimeout(setCookie, 300)
      userHelpers.sessionCreate(response.user).then((response) => {
        cookieValue = response
      })
      function setCookie() {
        res.status(202).cookie("mystore", `${cookieValue}`, { sameSite: 'strict', path: '/', expires: new Date(new Date().getTime() + 1200 * 1000), httpOnly: true })
        res.send({ userDatas })
        let date=new Date().getMilliseconds()
        console.log("loggedin ",date,loginStatus)
      }
    } else { 
      res.send({ userDatas: false })
      console.log("login failed");
    }
  })
})
app.get('/logout',(req,res)=>{
  cookieId=req.cookies.mystore;
  userHelpers.deleteSession(cookieId).then((response)=>{
      if(response){
        res.send({status:true})
      }else{
        res.send({status:false})
      }
  })
})
app.get('/cart/:id',(req,res)=>{
  let proId=req.params.id;
  if(req.cookies.mystore){
    let userId;
    let cookieId=req.cookies.mystore;
    userHelpers.getSession(cookieId).then((response)=>{
      userId=response.sessionData._id.toString()
      console.log(">>",userId);
      userHelpers.addToCart(proId,userId).then((response)=>{
        console.log(response);
        if(response){
          res.send({status:true})
        }else{
          res.send({status:false})
        }
      }) 
    })
  }else{
    console.log("nothing");
  } 
})  
app.get('/get-cart',(req,res)=>{
  if(req.cookies.mystore){
   let cookieId=req.cookies.mystore
    if(cookieId){
      userHelpers.getSession(cookieId).then((response)=>{
        if(response){
          console.log(response);
          userId=response.sessionData._id 
          sessionData=response.sessionData
          userHelpers.getCartItems(userId).then((products)=>{
            if(products){
              res.send({products,sessionData,status:true,cartItems:true})
            }else{
              res.send({cartItems:false,status:true,sessionData})
            }
          })
        }else{

        }
      })
    }else{

    }
  }
})
app.get('/profile',(req,res)=>{
  let cookieId=req.cookies.mystore
  if(cookieId){
    userHelpers.getSession(cookieId).then((response)=>{
      if(response){
        let userData = response.sessionData
        console.log(userData);
        res.send({userData,status:true})
      }else{
        res.send({status:false})

      }
    })
  }else{

  }
})
module.exports = app
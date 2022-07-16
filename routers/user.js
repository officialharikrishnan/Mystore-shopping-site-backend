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
//   if(req.cookies.mystore){
//   console.log(req.cookies.mystore);
// }
  productHelper.viewProducts().then((products) => {
    // {loginStatus && res.send({products})}
    res.send({products})
  })
  // console.log("home",loginStatus); 
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
        res.status(202).cookie("mystore", `${cookieValue}`, { sameSite: 'strict', path: '/', expires: new Date(new Date().getTime() + 120 * 1000), httpOnly: true })
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
app.get('/cart/:id',(req,res)=>{
  let proId=req.params.id;
  if(req.cookies.mystore){
    let userId;
    let cookieId=req.cookies.mystore;
    userHelpers.getSession(cookieId).then((response)=>{
      userId=response.sessionData._id.toString()
      console.log(">>",userId);
      userHelpers.addToCart(proId,userId).then((response)=>{
      }) 
    })
  }else{
    console.log("nothing");
  } 
  

})
module.exports = app
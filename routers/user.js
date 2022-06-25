const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser');
var productHelper=require('../helpers/product-helpers'); 
const userHelpers = require('../helpers/user-helpers');
app.use(cors());
// parse application/json
app.use(bodyParser.json());

app.get('/home', function (req, res) {
    console.log(req.body);
    productHelper.viewProducts().then((products)=>{
      
      // console.log(products[0].product.image1);
      res.send({products})
    })
  })
app.get('/uploads/:path',(req,res)=>{
  res.download('./uploads/'+req.params.path)
})
app.use(express.static(__dirname+'/uploads'));  
app.post('/signup-submit', function (req, res) {
    userHelpers.doSignup(req.body).then((response)=>{
      console.log(response);
      res.send("success")
    })
    console.log(req.body);
  })
app.post('/login-submit', function (req, res) {
    userHelpers.doLogin(req.body).then((response)=>{
      if(response.status){
        const userDatas=[
          response.status,
          response.user.name,
          response.user.phone,
          response.user._id
        ]
        console.log(userDatas);
        res.send({userDatas})
      }else{
        res.send({userDatas:false})
        console.log("login failed");
      }
    })
  })

  module.exports=app
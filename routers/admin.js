const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser');
var productHelper=require('../helpers/product-helpers') 
var imagename=[0,1]
const multer = require("multer")
var upload=multer();
const path = require('path');
const userHelpers = require('../helpers/user-helpers');
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
// parse application/json
app.use(bodyParser.json());
let cookieValue=""
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        
      callback(null, './uploads')
    },
    filename: function (req, file, callback) {
      const filetype=path.extname(file.originalname);
      callback(null, file.fieldname + '' + Date.now()+filetype)
    }
  }); 
  var upload = multer({ storage: storage }).array('image1',2);
app.post("/adminsignup",(req,res)=>{
  userHelpers.doAdminSignup(req.body).then((response)=>{
    console.log(response);
  })
})
app.post('/adminlogin-submit',(req,res)=>{
  // console.log("body>",req.body);
  userHelpers.doAdminLogin(req.body).then((response)=>{
    if(response._id){
      const adminDatas=[
        response.name,
        response.phone,
        response._id
      ]
      setTimeout(setCookie, 300)
      userHelpers.sessionCreate(response).then((response)=>{
        cookieValue=response
      })
      function setCookie(){
        res.status(202).cookie("mystoreAdmin", `${cookieValue}`, { sameSite: 'strict', path: '/', expires: new Date(new Date().getTime() + 1200 * 1000), httpOnly: true })
        res.send({ adminDatas })
      }
    }else{
      res.send({adminDatas:false})
    }
  })
})  
app.get('/admin',(req,res)=>{
    console.log(req.cookies.mystoreAdmin);
    userHelpers.getSession(req.cookies.mystoreAdmin).then((response)=>{
      console.log(response);
      if(response){
        let adminDatas=response.sessionData
        productHelper.viewProducts().then((products) => {
          res.send({products,adminDatas,status:true})
        })  
      }else{
        res.send({status:false})
      }
    })
  }) 
app.post('/addproduct',(req,res)=>{
    upload(req,res,function(err) {
      console.log(req.files);
      const fileInfo=req.body
      imagename[0]=req.files[0].filename
      if(req.files[1]){
        imagename[1]=req.files[1].filename
      }
      fileInfo.image1=imagename
    productHelper.addProduct(fileInfo)
    if(fileInfo.Name=='undefined'){
      res.send({status:"Please add a name"})
    }else{
      if(err) {
        res.send({status:"false"})
      }
      res.send({status:"true"});
    }

});

})
app.get('/getproduct/:id',(req,res)=>{
  productHelper.viewOneProduct(req.params.id).then((response) => {
    console.log(response);
    res.send(response)
  })
})
app.post('/updateproduct',(req,res)=>{
  
})
app.get('/deleteproduct/:id',(req,res)=>{
  console.log(req.params.id);
  productHelper.deleteProduct(req.params.id).then((response)=>{
    if(response){
      res.send({status:true})
    }else{
      res.send({status:false})
    }
  })
})
app.get('/getallusers',(req,res)=>{
  userHelpers.getSession(req.cookies.mystoreAdmin).then((response)=>{
    if(response){
      let adminDatas=response.sessionData

      userHelpers.getAllUsers().then((response)=>{
        if(response){
          res.send({users:response,adminDatas,status:true})
        }else{
          res.send({users:false})
        }
      })
    }else{
      res.send({status:false})
    }
  })
})
app.get('/admin-logout',(req,res)=>{
  console.log(req.cookies.mystoreAdmin);
  userHelpers.deleteSession(req.cookies.mystoreAdmin).then((response)=>{
    if(response){
      res.send({status:true})
    }else{
      res.send({status:false})
    }
})
})
module.exports=app
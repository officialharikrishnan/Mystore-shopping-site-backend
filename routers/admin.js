const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser');
var productHelper=require('../helpers/product-helpers') 
var imagename=[0,1]
const multer = require("multer")
var upload=multer();
const path = require('path');
app.use(cors());
// parse application/json
app.use(bodyParser.json());

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
  app.get('/admin',(req,res)=>{
    res.send("admin")
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
module.exports=app
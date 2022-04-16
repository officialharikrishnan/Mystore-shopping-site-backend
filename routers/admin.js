const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser');
var productHelper=require('../helpers/product-helpers') 

const multer = require("multer")
var upload=multer();
app.use(cors());
// parse application/json
app.use(bodyParser.json());

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        
      callback(null, './uploads')
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now())
    }
  });
  var upload = multer({ storage: storage }).array('image1',2);
  


app.get('/admin',(req,res)=>{
    res.send("admin")

})
app.post('/addproduct',(req,res)=>{
  upload(req,res,function(err) {
    // console.log(req.body);
    const fileInfo=req.body
    // console.log(req.files);
    // productHelper.addProduct(req.files)
    productHelper.addProduct(fileInfo)
    if(err) {
      res.send({status:"false"})
    }
    res.send({status:"true"});
    
});
   


})
module.exports=app
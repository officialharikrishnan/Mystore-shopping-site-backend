const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser');
var productHelper=require('../helpers/product-helpers') 

const multer = require("multer")
const upload=multer();
app.use(cors());
// parse application/json
app.use(bodyParser.json());

app.get('/admin',(req,res)=>{
    res.send("admin")

})
app.post('/addproduct', upload.single("image"),(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    // productHelper.addProduct(req.body)

})




module.exports=app
const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser');
var productHelper=require('../helpers/product-helpers') 



app.use(cors());
// parse application/json
app.use(bodyParser.json());

app.get('/admin',(req,res)=>{
    res.send("admin")

})
app.post('/addproduct',(req,res)=>{
    // console.log(req.body);
    productHelper.addProduct(req.body)

})




module.exports=app
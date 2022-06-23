const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser');
var productHelper=require('../helpers/product-helpers') 
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
    console.log(req.body);
  })
app.post('/login-submit', function (req, res) {
    console.log(req.body);
  })

  module.exports=app
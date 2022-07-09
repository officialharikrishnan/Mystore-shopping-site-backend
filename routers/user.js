const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser');
const Cookies=require('js-cookie')
const cookieParser = require("cookie-parser");
var productHelper = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');


app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(cookieParser());
let cookieValue=""
app.get('/home', function (req, res) {
  console.log(">>",req.cookies);
  productHelper.viewProducts().then((products) => {
    res.send({ products })
  })
})
app.get('/viewoneproduct/:id', function (req, res) {
  var id = req.params.id;
  productHelper.viewOneProduct(id).then((response) => {
    console.log(response);
    res.send(response)
  })
})
app.get('/uploads/:path', (req, res) => {
  res.download('./uploads/' + req.params.path)
})
app.post('/signup-submit', function (req, res) {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    res.send("success")
  })
  console.log(req.body);
})
app.post('/login-submit', function (req, res) {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      const userDatas = [
        response.status,
        response.user.name,
        response.user.phone,
        response.user._id
      ]
      setTimeout(setCookie, 1500)
      userHelpers.sessionCreate(response.user).then((response) => {
        cookieValue = response
      })
      function setCookie() {
        res.status(202).cookie("name", `${cookieValue}`, { sameSite: 'strict', path: '/', expires: new Date(new Date().getTime() + 15 * 1000), httpOnly: true })
        res.send({ userDatas })
      }
    } else {
      res.send({ userDatas: false })
      console.log("login failed");
    }
  })
})


module.exports = app
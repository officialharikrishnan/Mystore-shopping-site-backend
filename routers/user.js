const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser');
var productHelper = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
app.use(cors());
app.use(bodyParser.json());
let cookieValue;
app.get('/', function (req, res) {
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
app.post('/login-submit', function (req, res, next) {
  console.log(">>>", req.body);
  userHelpers.doLogin(req.body).then((response) => {
    // req.session.user = response.user
    if (response.status) {
      const userDatas = [
        response.status,
        response.user.name,
        response.user.phone,
        response.user._id
      ]
      setTimeout(setCookie, 2000)
      userHelpers.sessionCreate(response.user).then((response) => {
        cookieValue = response
        console.log("ff>>>", cookieValue);
      })
      function setCookie() {
        res.status(202).cookie("Name", cookieValue, { sameSite: 'strict', path: '/', expires: new Date(new Date().getTime() + 10 * 1000), httpOnly: true })
        console.log("worked");
        res.send({ userDatas })
      }
    } else {
      res.send({ userDatas: false })
      console.log("login failed");
    }
  })
})

module.exports = app
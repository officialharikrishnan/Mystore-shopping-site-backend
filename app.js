const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser');

app.use(cors());
// parse application/json
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World')
  // console.log(req)
})
app.post('/signup-submit', function (req, res) {
  console.log(req.body);
})
app.post('/login-submit', function (req, res) {
  console.log(req.body);
})
const port=4000;

app.listen(port, () =>{console.log(`server started on ${port}`)})
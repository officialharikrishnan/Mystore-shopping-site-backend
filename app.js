const express = require('express')
const app = express()

app.get('/new', function (req, res) {
  res.send('Hello World')
})
const port=4000;

app.listen(port, () =>{console.log(`server started on ${port}`)})
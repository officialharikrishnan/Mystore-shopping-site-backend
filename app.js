const express = require('express');
const app = express();
var db = require('./helpers/connection');
var userRouter = require('./routers/user');
var adminRouter = require('./routers/admin')
const session = require('express-session')

db.connect((err) => {
  if (err) {
    console.log(err)
  } else {
    console.log("database connected");
  }
})
app.use(session({
  secret: "key",
  cookie: { maxAge: 20000 },
  resave: false,
  saveUninitialized: true
}))
app.use('/', userRouter)
app.use('/admin', adminRouter)
const port = 4000;

app.listen(port, () => { console.log(`server started on ${port}`) })
module.exports = app;






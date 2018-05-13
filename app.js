const express = require('express');
const logger = require('morgan');
const https = require("https");
const path = require('path');
const fs = require("fs");
const app = express();

const options = {
  key: fs.readFileSync('certificate/server.key'),
  cert: fs.readFileSync('certificate/server.crt')
};


let videoAPI = require("./controllers/videos");


app.use(function(req,resp,next){
  resp.header("Access-Control-Allow-Origin","*");
  resp.header("Access-Control-Allow-Headers","X-ACCESS_TOKEN","Access-Control-Allow-Origin",
    "Authorization","Origin","x-requested-with","Content-Type");
  resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
  next();
});

app.use(logger('dev'));
app.use("/api/videos",videoAPI);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json(err);

});

https.createServer(options, app).listen(9050);

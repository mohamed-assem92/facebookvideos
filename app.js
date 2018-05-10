const express = require('express');
const path = require('path');
const fs = require("fs");
const mongoose = require('mongoose');
const https = require("https");
const app = express();

const options = {
  key: fs.readFileSync('certificate/server.key'),
  cert: fs.readFileSync('certificate/server.crt')
};

process.env.sercret = "@%$^*&@^#%$@^%%#$&^@";

mongoose.connect("mongodb://localhost:27017/fb");

fs.readdirSync(path.join(__dirname, "models")).forEach(function (filename) {
  require('./models/' + filename);
});


app.use(function(req,resp,next){
  resp.header("Access-Control-Allow-Origin","*");
  resp.header("Access-Control-Allow-Headers","X-ACCESS_TOKEN","Access-Control-Allow-Origin",
    "Authorization","Origin","x-requested-with","Content-Type");
  resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
  next();
});


https.createServer(options, app).listen(9050);

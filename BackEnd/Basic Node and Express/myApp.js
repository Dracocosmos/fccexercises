let express = require('express');
let app = express();
require('dotenv').config()

console.log("Hello World");

let absolutePath = __dirname + '/views/index.html'

function indexHandler(req, res) {
  res.sendFile(absolutePath)
}

app.use('/public', express.static(__dirname + '/public'))
app.get('/', indexHandler);

function jsonHandler(req, res) {
  var mStyle = process.env.MESSAGE_STYLE;
  var message = mStyle == 'uppercase'
    ? "HELLO JSON"
    : "Hello json";
  res.json({ "message": message });
};

app.get('/json', jsonHandler)




















module.exports = app;

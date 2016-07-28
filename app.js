var express = require('express');
var app = express();
var validUrl = require('valid-url');
var Crypto = require('crypto');

var urls = [];

function isValidUrl(url){
  if (validUrl.isUri(url)){
        return true;
    } else {
        return false;
    }
}

//Taken from https://github.com/viruzx/Collectivist/blob/master/app.js
function newToken() {
    return Crypto.randomBytes(8).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
}

function shorten(url){
  var short =  newToken();
  urls[short] = url;
  return short;
}
app.get('/', function (req, res) {
  res.send("Usage here: https://little-url.herokuapp.com/");
});
app.get('/:short', function (req, res) {

  if (urls[req.params.short]){
    res.redirect(urls[req.params.short]);
    res.send("Redirecting to " + urls[req.parmas.short]);
  } else {
    var response = {
      error: "URL not found"
    }
    res.send(JSON.stringify(response));
  }

});
app.get('/new/*', function (req, res) {
  var url = req.originalUrl.replace("/new/", "");
  if (isValidUrl(url)){
    var short = shorten(url);
    var response = {
      short: 'https://fathomless-mesa-75244.herokuapp.com/' + short,
      long:  url
    }
    res.send(JSON.stringify(response));
  } else {
    var response = {
      error: "URL not valid"
    }
    res.send(JSON.stringify(response));
  }
});

app.listen(process.env.PORT || 3543, function () {
});

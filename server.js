var fs = require('fs');
var path = require('path');

var express = require('express');
var cors = require('cors');
var marked = require('marked');

var generate = require('./generate');
var solution = require('./solution');

var DATA_COUNT = 2000;
var INSTRUCTIONS = 'README.md';
var DATA = 'data.txt';

var app = express();

app.use(cors());

app.get('/', function (req, res, next) {
  fs.readFile(path.resolve(__dirname, INSTRUCTIONS), 'utf8', (err, txt) => {
    if (err) {
      return next(err);
    }
    
    const html = `
      <html>
      <head>
        <title>Instructions</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
      <div class="markdown-body" style="width: 980px; padding: 45px">
        ${marked(txt)}
      </div>
      </body>
      </html>
    `;
    
    return res.send(html);
  });
});

app.get('/style.css', (req, res, next) => {
  return res.sendFile(path.resolve(__dirname, 'public/style.css'));
});

app.get('/data.txt', (req, res) => {
  res.sendFile(path.resolve(__dirname, DATA));
});

app.get('/generate', (req, res, next) => {
  const data = generate(DATA_COUNT);
  fs.writeFile(DATA, data, 'utf8', (err) => {
    if (err) {
      return next(err);
    }
    
    res.setHeader('content-type', 'text/plain');
    return res.send(data);
  });
});

app.get('/solution', (req, res, next) => {
  solution().then(report => {
    res.setHeader('content-type', 'text/plain');
    res.send(report);
  }, next);
});

var server = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + server.address().port);
});

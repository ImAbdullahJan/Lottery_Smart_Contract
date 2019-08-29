
//read http://webapplog.com/express-js-4-node-js-and-mongodb-rest-api-tutorial/

// -- App specific - Fill this one and all good --
var CONFIG = {
  PORT: 9000,
  SERVE_DIR: '/',
  HOME_PAGE_REDIRECT: '/index.html',
  APP_NAME: '"My App"'
};
// --- App specific --- //

var express = require('express');
var bodyParser = require('body-parser');

/* Additional APIs / middle-wares */
// var myApp = require('./my-app.js');

var app = express();

// setup PORT
var port = process.env.PORT || CONFIG.PORT;
app.set('port', port);

// needs only when homepage is not index.html - the static server of express handle the '/' with the 'index.html' by default.
if (CONFIG.HOME_PAGE_REDIRECT && CONFIG.HOME_PAGE_REDIRECT !== '/index.html') {
  app.get('/', function(req, res) {
    //console.log('/ get request - ');
    res.redirect(CONFIG.HOME_PAGE_REDIRECT);
    //res.sendFile( __dirname + CONFIG.SERVE_DIR + CONFIG.HOME_PAGE);
  });
}

// setup serving static files
app.use(express.static(__dirname + CONFIG.SERVE_DIR));

// Allowing CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/* body parser middleware for reading GET / POST request params, and body/payload */
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/* Additional APIs / middle-wares */
// myApp(app);

// Initialize the server App
app.listen(port, function() {
  console.log(CONFIG.APP_NAME + ' Node app is running at localhost:' + port);
});

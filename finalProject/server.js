// import packages (node-modules)
var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var router = express.Router(); // Invoke the Express Router
var appRoutes = require('./app/routes/api')(router);
var path = require('path');
var passport = require('passport');
var social = require('./app/passport/passport')(app, passport);

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.json()); // Body-parser middleware
app.use(bodyParser.urlencoded({
    extended: true
})); // For parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public')); // Allow front end to access public folder
app.use('/api', appRoutes);

mongoose.connect('mongodb://localhost:27017/finalproject', function (err) {
    if (err) {
        console.log('Not connected to the database: ' + err);
    } else {
        console.log('Successfully connected to MongoDB');
    }
});


app.get('*', function(req, res){
   res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// Start Server
app.listen(port, function () {
    console.log('Running the server on port ' + port); // Listen on configured port
});

'use strict';

var express = require('express');
var app = express();
var profileRouter = express.Router();

require('./routes/profiles_routes')(profileRouter);

app.use('/api', profileRouter);

app.listen(3000, function() {
  console.log('server running on port ' + 3000);
});

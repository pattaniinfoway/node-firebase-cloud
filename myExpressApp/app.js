const Express = require('express');
const bodyParser = require('body-parser');

const app = Express();

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))



//const config = require('./config.js');
var indexRouter = require('./routes/index');

app.use(Express.static(path.join(__dirname, 'public')));  
// for file upload  


//route 
app.use('/', indexRouter);


//catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});
  
//error handler
app.use((err, req, res, next) => { 
  console.log(req);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  // logger.info(err)
  res.status(err.status || 500);
  res.json({ error: err });
}); 

module.exports = app;
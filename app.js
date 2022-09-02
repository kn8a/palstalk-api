var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDb = require('./config/db')
const dotenv = require('dotenv').config()
const cors = require('cors')
const Upload = require('./models/uploadModel')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var requestsRouter = require('./routes/requests');
var postsRouter = require('./routes/posts');
const { protect } = require('./middleware/authMiddleware');
const expressAsyncHandler = require('express-async-handler');
const asyncHandler = require('express-async-handler')

connectDb()


var app = express();

// view engine setup
app.use(cors());
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const getFile = asyncHandler( async (req,res) => {
  const file = await Upload.findById(req.params.imageId)
  //console.log(req)
  res.status(200).header('Content-Type', file.file.contentType).send(file.file.data)
})

app.get('/api/file/:imageId', getFile)


app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/posts', postsRouter)






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;

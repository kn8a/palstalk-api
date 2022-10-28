var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
const connectDb = require("./config/db")
const dotenv = require("dotenv").config()
const cors = require("cors")
const Upload = require("./models/uploadModel")

var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")
var requestsRouter = require("./routes/requests")
var postsRouter = require("./routes/posts")
const { protect } = require("./middleware/authMiddleware")
const expressAsyncHandler = require("express-async-handler")
const asyncHandler = require("express-async-handler")

connectDb()

var app = express()

app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

//getting images from URL
const getFile = asyncHandler(async (req, res) => {
  console.log(req.params.imageId)
  if (req.params.imageId) {
    const file = await Upload.findById(req.params.imageId)
    console.log(req.params.imageId)
    console.log(file)
  res
    .status(200)
    .header("Content-Type", file.file.contentType)
    .send(file.file.data)
    console.log("return")
    return
  } else {
    res.status(200).json({message: 'waiting for filename'})
    return
  }
  
})

const pingServer = asyncHandler(async (req, res) => {
  const message = "ok"
  res.status(200).json({ message: message })
})

app.get("/api/file/:imageId", getFile)
app.get("/api/ping", pingServer)
app.use("/", indexRouter)
app.use("/api/users", usersRouter)
app.use("/api/requests", requestsRouter)
app.use("/api/posts", postsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

module.exports = app

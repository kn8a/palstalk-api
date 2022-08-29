// upload.js
const express = require('express')
const multer  = require('multer')
//importing mongoose schema file
const Upload = require("../models/uploadModel");
const app = express()
//setting options for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const express = require('express');
const bodyParser = require('body-parser');
const routes = require("./routes");
const mongoose = require('mongoose');

const app =express();
const port = 3000;
let {dbUrl}=require("./config.json");
mongoose.connect(dbUrl)

process.on("unhandledRejection",(err)=>console.error(err.stack))

app
.use(express.urlencoded({extended:true,}))
.use(bodyParser.json())
.get("/",(req,resp)=>{resp.status(200).end("App is working")})
.use("/orders",routes)

.listen(port,(err,data)=>{
    console.log("Server is running on "+port)
})
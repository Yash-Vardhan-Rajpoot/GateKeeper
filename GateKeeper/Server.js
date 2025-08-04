//this is express part
const express=require("express");
const server=express();
//this is data parsing port
const bodyparser=require("body-parser");
server.use(bodyparser.urlencoded({ extended: true }));
server.use(express.json());
//this is session creation part
const session = require('express-session');
server.use(session({ secret: 'master', resave: false, saveUninitialized: true }));
server.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.currentUser = req.session.user || null;
  next();
});
//this is public folder part
server.set('view engine', 'ejs');
server.set('views', __dirname + '/Public');
//this is for static file folder
server.use(express.static(__dirname + '/Public')); 
//this is route handling part
const routes=require("./routes");
server.get("/signup",routes.preSignup);
server.get("/login",routes.preLogin);
server.post("/signup",routes.postSignup);
server.post("/login",routes.postLogin);
server.get("/logout",routes.logout);
//this is server running part
const port=3000;
server.listen(port,()=>{
    console.log(`server is started at port number:${port}`)
});
//this is datanbase part
const { save, find } = require("./Database");
//this is express part
const express = require("express");
// this is validator part
const { check, validationResult } = require("express-validator");
//this is password hashing part
const bcrypt=require("bcryptjs")
// Render signup page
exports.preSignup = (req, res, next) => {
  res.render("signup",{
    pagetitle:"signup",
    currentpage:"signup",
    errors:[],
    oldinputs:{},
  });
};

// Render login page
exports.preLogin = (req, res, next) => {
  res.render("login",{
    pagetitle:"login",
    currentpage:"login",
    errors:[],
    oldinputs:{},
  });
};

// Handle signup form
exports.postSignup =[
  check("firstname")
  .notEmpty()
  .withMessage("Firstname is required")
  .trim()
  .isLength({min:2})
  .withMessage("First name must be aleast 2 character long")
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("Firstname can only contain characters"),
  check("lastname")
  .notEmpty()
  .withMessage("Lastname is required")
  .trim()
  .isLength({ min: 2 })
  .withMessage("Last name must be at least 2 characters long")
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("Lastname can only contain letters and spaces"),
  check("phonenumber")
  .notEmpty()
  .withMessage("Phone number is required")
  .trim()
  .isLength({min:10})
  .isMobilePhone()
  .withMessage("Invalid phone number format"),
  check("email")
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Enter a valid email address")
  .normalizeEmail(),
  check("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long"),
  async (req, res, next) => {
  try {
    const { firstname, lastname, phonenumber, password, email} = req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return  res.render("signup",{
            pagetitle:"signup",
            currentpage:"signup",
            errors:errors.array().map(e=>e.msg),
            oldinputs:{ firstname, lastname, phonenumber, password, email},
        })
    }
    const hashpassword=await bcrypt.hash(password,12);
    const user=await save(firstname, lastname, phonenumber, hashpassword, email);
    if(!user){
        res.status(404).redirect("/signup");
    }
    else res.status(200).redirect("/login");
    
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).send("Internal Server Error"); 
  }
}];


// Handle login form
exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await find(email);

    if (!user) {
      console.log("Unable to find user");
      return res.render("login", {
        pagetitle: "login",
        currentpage: "login",
        errors: ["User not found"],
        oldinputs: { email },
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("postLogin", {
        pagetitle: "login",
        currentpage: "login",
        errors: ["Invalid Password"],
        oldinputs: { email },
      });
    }
    req.session.user = {
      email: user.email,
      name: user.firstname
    };
    req.session.isLoggedIn = true;
    console.log("Login successful");
    res.status(200).render("postLogin", {
      pagetitle: "login",
      currentpage: "login",
      user: req.session.user
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal server error");
  }
};
// this is logout part
exports.logout=(req,res,next)=>{
    req.session.destroy((err)=>{
        if(err) return res.redirect("/login");
    res.clearCookie('connect.sid');
    return res.send("user is successfully logout");
    });
};

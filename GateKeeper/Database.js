const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_info");

const schema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    phonenumber: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 15
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    email:{
        type:String,
        required:true,
        unique:true,
    }
}, { timestamps: true });
const user = mongoose.model("user_data", schema, "user_data");

async function save(firstname, lastname, phonenumber, password,email) {
    const newUser = new user({
        firstname,
        lastname,
        phonenumber,
        password,
        email
    });
    return await newUser.save();
}
async function find(email){
    const info=user.findOne({email});
    return await info;
}
module.exports = { save, find };
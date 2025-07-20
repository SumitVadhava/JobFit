const mongoose = require('mongoose');
const { type } = require('os');

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required : true
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['admin', 'user','recruiter', 'candidate'],
        default: 'user',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active', 
        required: true,
    },
    recruiterKey: {
        type: String,
        required: false,
        default: null,
    },
  }
);

module.exports = mongoose.model("logins",userSchema);
const mongoose = require ('mongoose')

const user = new mongoose.Schema({
    name:{
        type:String,
    },
    fathername:{
        type:String,
    },
    Email:{
        type:String,
    },
    Mobileno:{
        type:String,
    },
    otp:{
        type:String,
    },
})

const result = new mongoose.model("detail",user)
module.exports = result
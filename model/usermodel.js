const mongoose = require ('mongoose')

const newuser = new mongoose.Schema ({
    Username:{
        type:String,
    },
    Password:{
        type:String,
    },
    Session:{
        type:String,
    },
    token:{
        type:String,
    },
})
const newresult = new mongoose.model("Id detail",newuser)
module.exports = newresult
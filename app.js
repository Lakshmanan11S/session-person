const express = require ('express');
const bodyparser = require ('body-parser');
const mongoose = require ('mongoose');
const session = require ('express-session')
const PORT = 4000;
const cookieparser = require ('cookie-parser')
const userrouter = require ('./router/route.js')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(cookieparser())
app.use(bodyparser.json())



app.use(session({
    secret:'secret key',
    saveUninitialized:false,
    resave:false,
    cookie:{maxAge:6000}
    
}))


mongoose.connect(process.env.DATABASE_URL)
.then(data=>console.log("mongo db is connected"))
.catch(error=>console.log("mongo db is not connected"))

app.get('/',(req,res)=>{
    res.send("person details")
})
app.use('/api',userrouter)



app.listen(PORT,()=>console.log("server is running on",PORT))
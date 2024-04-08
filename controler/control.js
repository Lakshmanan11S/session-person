const express = require ('express')
const usermodel = require ('../model/model.js')
const usertable = require ('../model/usermodel.js')
const nodemailer = require ('nodemailer')
const jsonwebtoken = require ('jsonwebtoken')
const bcrypt = require ('bcrypt')

exports.create = async (req,res)=>{
    try{
        const userdetails = new usermodel({
            name:req.body.name,
            fathername:req.body.fathername,
            Email:req.body.Email,
            Mobileno:req.body.Mobileno,
            otp:null
        })
        await userdetails.save()
        const name = req.body.name;
        const fathername = req.body.fathername;
        const Mobileno = req.body.Mobileno;
        const username = name.slice(0,4) + fathername.slice(0,1)
        const password = name +"@"+Mobileno.slice(6,10)
        const saltRounds = 10;
        const hashpassword = await bcrypt.hash(password,saltRounds)
        const iddetails = new usertable({
            Username:username,
            Password:hashpassword
        })
        await iddetails.save()
        res.send({
            message:"user id details are saved",
            data:username,
            password
        })

        const transporter = nodemailer.createTransport({
            service:'gmial',
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth:{
                user:process.env.Email,
                pass:process.env.pass
            }
        })
        const mailoption = {
            from:process.env.Email,
            to:'lakshmanan@elonnativesystem.com',
            subject:'your username and password details',
            text:`username:${username},password:${password}`
        }
        transporter.sendMail(mailoption,function(error,info){
            if(error){
             res.status(500).json({message:"mail send not successfully"})
            }else{
                res.status(200).json({message:"mail send successfully"})
            }
        })
    }catch(error){
        res.status(500).json({message:"server error"})
    }
}

exports.login = async(req,res)=>{

     try{
    const{username,password} = req.body;
    const userfound = await usertable.findOne({Username:username})
    if(!userfound){
         return res.status(500).json({message:"username invalid"})
    }
    const matchpassword = await bcrypt.compare(password,userfound.Password)
    if(!matchpassword){
        return res.status(500).json({message:"password invalid"})
    }
    console.log(matchpassword)
    const accestoken = jsonwebtoken.sign({usertable:req.body.Username},process.env.ACCESS_TOKEN)
    userfound.token = accestoken
    
    await userfound.save()


    if(username,password){
        req.session.isLoggedIn = true;
        req.session.username = username
        userfound.Session = req.session.id
        await userfound.save()
               res.status(200).json({message:"login successful"})
    }else{
        res.status(500).json({messagge:"username and password not valid"})
    }
     }catch(error){
        res.status(500).json({message:"server error"})
     }}


exports.logout= async(req,res)=>{
    try{
        const username = req.body.username
        const sessionid = req.headers.cookie.split('=')[1];
        const userFound = await usertable.findOne({Username:username});
        console.log(sessionid)
        if(!userFound){
             res.status(500).json({message:"username not found"})
         }if(!sessionid){
            res.status(500).json({message:"session id error"})
        }
                
                  req.session.destroy ((error)=>{
                if(error){
                    res.status(500).json({message:"session expries"})
                }else{
                   res.status(200).json({message:"logout successfully"})}})
}catch(error){
    res.status(500).json({message:"server error"})
}
}



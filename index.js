const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.urlencoded({extended:true,limit: "50mb"}))
app.use(express.json({limit:"50mb"}))
app.use(cors())
const cloudinary = require('cloudinary')
const dotenv = require('dotenv');
dotenv.config()
require('./connection/mongoose.connection')
let betModel = require('./models/user.model')
let tutorModel = require('./models/user.modell')
const jwt = require('jsonwebtoken')

cloudinary.config({ 
    cloud_name:  process.env.CLOUD_NAME,
    api_key:  process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });


let PORT = process.env.PORT_NUMBER || 4250
let TOK = process.env.TOKEN

app.post('/media',(req,res)=>{
    let myfile = req.body.myfile
    cloudinary.v2.uploader.upload (myfile,(error, result)=>{
    if (error) {
        console.log('failed to upload');
        console.log(error);        
    } else {
        console.log(result);
        let link = result.secure_url
        res.send({link})
    }
    })
})


app.get('/dashboard',(req,res)=>{
let token = req.headers.authorization.split(" ")[1]
jwt.verify(token,TOK)
    betModel.find()
    .then((result)=>{
        console.log(result)
        res.send(result)
    })
    .catch((err)=>{
        console.log(err);       
    })
})

app.post('/signupp',(req,res)=>{        
    let bet = new betModel(req.body);    
    bet.save()
    .then((result)=>{
        // console.log("bet submitted successfully");
        console.log(result);        
        res.send({message : "successfull"})  
    }) 
    .catch((err)=>{
        console.log(err);        
    })    
})

app.post('/pix',(req,res)=>{
    let tutor = new tutorModel(req.body);    
    tutor.save()
    .then((result)=>{
        // console.log("pix submitted successfully");
        console.log(result); 
        res.send({result, message : "successfull"})        
    }) 
    .catch((err)=>{
        console.log(err);        
    })
})

app.post("/signin", (req,res)=>{
    let {email, password} = req.body
    betModel.findOne({email:email})
    // betModel.findOne({email:req.body.email, password:req.body.password})
    .then((result)=>{
        // console.log(result); 
        if (result !=null) {
            result.validatePassword(password,(err,same)=>{
                if(same){
                   let token = jwt.sign({email},TOK,{expiresIn:"24h"})
                   console.log(token)
                   res.send({result, message:'user found',status:true,token})                   
               }
            })
        } else {
           res.send({message: 'user not found',status:false}) 
        }            
    })
    .catch((err)=>{
        console.log(err);        
    })
})

app.post("/delete",(req,res)=>{
    // console.log(req.body.email);
     betModel.deleteOne({email:req.body.email})
    .then((result)=>{
        console.log(result);
        if (result !=null) {
            res.send({result, message:'Deleted Successfully'})
            } else {
               res.send({message: 'Try Again'}) 
            }            
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.post("/edit",(req,res)=>{
    console.log(req.body.email)
    // betModel.findOne({email:req.body.newEmail})
      betModel.findOne()
    .then((result)=>{
        if(result) {
            // res.render("editusers", {info: result})
            // console.log(result);
            res.send({result, message:'Edit Successfully'})
        } else {
            res.send({message: 'Try Again'}) 
         }       
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.post("/update",(req,res)=>{
    console.log(req.body.email)
    // betModel.updateOne({email:req.body.email}, req.body)  
    betModel.updateOne()     
    .then((result)=>{
        // console.log("form updated successfully");  
        // console.log(result);        
    })
    
    .catch((err)=>{
        console.log(err);
    })
})

// app.get("/chat",(req,res)=>{})


let connection = app.listen(PORT,()=>{
    console.log(`successful, running on port ${PORT}`)
})

let socketClient=require("socket.io")
let io = socketClient(connection,{
    cors :{origin:"*"}
})
io.on("connection",(socket)=>{
    // console.log(socket.id)
    console.log("A user connected successfully")
    socket.on("sendMsg",(message)=>{
        console.log(message)
        io.emit("broadcastMsg",message)
    })
    
    socket.on("disconnect",()=>{
            console.log("someone disconnected")
        })
    })
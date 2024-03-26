const mongoose = require('mongoose')

let MONGODB_URI = process.env.URI

mongoose.connect(MONGODB_URI)
.then(()=>{
    console.log("Mongoose has connected successfully")
})
.catch((err)=>{
    console.log(err);
})
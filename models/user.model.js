const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')

// let tutorSchema = ({
//     myimage: {type: String, required: true},
//     date: {type: Date, default: Date.now}
// })

let betSchema = new mongoose.Schema({
    firstname: {type: String, required: true,},
    lastname: {type: String, required: true}, 
    phone: {type: String, required: true},  
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},    
    date: {type: Date, default: Date.now} 
});

let saltRounds = 10;
betSchema.pre ('save', function(next){
    console.log(this.password);
    bcryptjs.hash(this.password, saltRounds)
    .then(res => {
        console.log(res)
        this.password = res;
        next()
    })
    .catch(err => {
        console.log(err)
    });
})

betSchema.methods.validatePassword = function(password,callback){
    bcryptjs.compare(password,this.password,(err,same)=>{
        if(!err){
            callback(err,same)
        }else{
            next()
        }
    })
}
// let tutorModel = mongoose.model("user", tutorSchema);
let betModel = mongoose.model("users", betSchema);

// module.exports = tutorModel
module.exports = betModel
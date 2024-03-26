const mongoose = require('mongoose')


let tutorSchema = new mongoose.Schema({
    myimage: {type: String, required: true},
    date: {type: Date, default: Date.now}
})


let tutorModel = mongoose.model("user", tutorSchema);



module.exports = tutorModel
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        about:{
            type: String,
            required: true
        },
        adress: {
            type: String,
            required: true
        },
        website:{
            type: String
        },
        role:{
            type: String,
            required: true
        },
        profilePic:{
            type:String
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('userModel', userSchema)
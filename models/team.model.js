const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        adminId: {
            type: String,
            required: true
        },
        members: {
            type: Array,
            default: []
        },
        adress: {
            type: String,
        },
        website:{
            type: String
        },
        profilePic: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('teamModel', teamSchema)
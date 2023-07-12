const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        type: {
            type:String,
            required: true
        },
        name:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        over:{
            type: Boolean,
            default: false,
        },
        userId:{
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('projectModel', projectSchema)
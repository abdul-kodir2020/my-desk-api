const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        critical:{
            type: Boolean,
            default: false,
            required: true
        },
        over:{
            type: Boolean,
            default: false,
        },
        projectId:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('taskModel', taskSchema)
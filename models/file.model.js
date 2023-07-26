const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required:true
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

module.exports = mongoose.model('fileModel',fileSchema)
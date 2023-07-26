const fileModel = require("../models/file.model");
const fs = require('fs')


const joi = require('joi')

const schemaFile = joi.object(
    {
        name: joi.string().min(5).required(),      
        type: joi.string().min(3).required(),
        projectId: joi.string().required(),
            
    }
)

module.exports.addFile = async(req, res)=>{
    
    const {error} = schemaFile.validate(req.body)
    if(error) return res.status(400).json(error.details[0].message)

    try {
        const nameExist = await fileModel.findOne({name: req.body.name})
        if(nameExist) return res.status(400).json('Un fichier porte déjà ce nom')

        const newFile = new fileModel({
            name: req.body.name,
            type: req.body.type,
            path: req.file.path,
            projectId: req.body.projectId
        })

        const fileSaved = await newFile.save()
        res.json({fileSaved})
    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports.getFiles = async(req, res)=>{
    try {
        const files = await fileModel.find({projectId: req.params.projectId}).sort({createdAt: -1})
        res.json({files})
    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports.deleteFile = async(req, res)=>{
    try {
        const file = await fileModel.findById(req.params.id)
        if(!file) return res.status(400).json("Ce fichier n'existe pas")

        fs.unlink(file.path,  (err) => {
            if (err) {
              throw new Error('Erreur lors de la suppression du fichier');
            }
        })

        await fileModel.findByIdAndDelete(file)

        res.json('Fichier supprimé')
    } catch (error) {
        res.status(400).json({error})
    }
}
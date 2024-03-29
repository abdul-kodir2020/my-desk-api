const joi = require("joi");
const projectModel = require("../models/project.model");

const schemaAdd = joi.object(
    {
        type: joi.string().min(3).required(),
        name: joi.string().min(2).required(),
        description: joi.string().min(10).required(),
    }
)

module.exports.getProjects = async(req, res) =>{
    const projects = await projectModel.find({userId: req.userId}).sort({createdAt: -1});
    res.json({projects});
}

module.exports.getOneProject = async (req, res) =>{
    const project = await projectModel.findById(req.params.id)
    if(!project) return res.status(400).json('Aucune projet de cet id')

    res.json({project})
}

module.exports.addProject = async (req, res) =>{
    const {error} = schemaAdd.validate(req.body)
    if(error) return res.status(400).json(error.details[0].message)

    const project = await projectModel.findOne({name : req.body.name})
    if(project) return res.status(400).json("Ce projet existe déjà")

    const newProject = new projectModel({
        type: req.body.type.toLowerCase(),
        name: req.body.name.toLowerCase(),
        description: req.body.description.toLowerCase(),
        over: false,
        userId: req.userId
    })

    try {
        const projectCreated = await newProject.save()
        res.json({projectCreated})
    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports.updateProject = async(req, res)=>{
    try {
        const project = await projectModel.findById(req.params.id)
        if(!project) return res.status(400).json('Aucun projet de cet id')

        await projectModel.findByIdAndUpdate(project, req.body)
        const updatedProject = await projectModel.findById(req.params.id)
        res.json({updatedProject})
    } catch (error) {
        res.status(400).json({error})
    }
    
}


module.exports.deleteProject = async(req, res) =>{
    const id = req.params.id
    const project = await projectModel.findById(id)
    if(!project) return res.status(400).json('Aucun projet de cet id')

    try {
        project.deleteOne()

        res.json({id})
    } catch (error) {
        res.status(400).json({error})
    }
}
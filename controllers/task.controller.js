const joi = require('joi')
const taskModel = require("../models/task.model");
const projectModel = require('../models/project.model');

const schemaAdd = joi.object(
    {
        name: joi.string().min(2).required(),
        description: joi.string().min(10).required(),
        critical: joi.boolean(),
        over: joi.boolean(),
        projectId: joi.string().required()
    }
)

module.exports.getTasks = async(req, res) =>{
    const tasks = await taskModel.find({projectId: req.body.projectId});
    res.json({tasks});
}

module.exports.getOneTask = async (req, res) =>{
    const task = await taskModel.findById(req.params.id)
    if(!task) return res.status(400).json('Aucune tâche de cet id')
    res.json({task})
}

module.exports.addTask = async (req, res) =>{
    try {
        const {error} = schemaAdd.validate(req.body)
        if(error) return res.status(400).json(error.details[0].message)

        const task = await taskModel.findOne({name : req.body.name})
        if(task) return res.status(400).json("Cette tâche existe déjà")

        const newTask = new taskModel({
            name: req.body.name,
            description: req.body.description,
            critical: req.body.critical || false,
            over: false,
            projectId: projectId
        })

        const taskCreated = await newTask.save()
        res.json({taskCreated})
    } catch (error) {
        console.log(error)
        res.status(400).json({error})
    }
}

module.exports.updateTask = async(req, res)=>{
    const task = await taskModel.findById(req.params.id)
    if(!task) return res.status(400).json('Aucune tâche de cet id')

    try {
        taskUpdated = await taskModel.findByIdAndUpdate(task, req.body)
        res.json({taskUpdated})
    } catch (error) {
        res.status(400).json({error})
        
    }
}

module.exports.deleteTask = async(req, res) =>{
    const id = req.params.id
    const task = await taskModel.findById(id)
    if(!task) return res.status(400).json('Aucune tâche de cet id')

    try {
        task.deleteOne()
        res.json({id})
    } catch (error) {
        res.status(400).json({error})
    }
}
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
    const tasks = await taskModel.find({projectId: req.params.projectId});
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

        const newTask = new taskModel({
            name: req.body.name.toLowerCase(),
            description: req.body.description.toLowerCase(),
            critical: req.body.critical || false,
            over: false,
            projectId: req.body.projectId
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
        const taskUpdated = await taskModel.findByIdAndUpdate(task, req.body)
        const tasks = await taskModel.find({projectId: task.projectId});
        const tasksOver = tasks.filter((task)=>task.over === true)
        
        if (tasks.length === tasksOver.length) {
            await projectModel.findByIdAndUpdate(task.projectId, {over: true})
        }else{
            await projectModel.findByIdAndUpdate(task.projectId, {over: false})
        }

        const project = await projectModel.findById(task.projectId)

        res.json({taskUpdated, project})
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
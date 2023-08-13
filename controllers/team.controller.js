const joi = require("joi");
const teamModel = require("../models/team.model");

const schemaAdd = joi.object(
    {
        name: joi.string().min(3).required(),
        adress: joi.string(),
        website: joi.string()
    }
)

module.exports.addTeam = async(req, res)=>{
    const {error} = schemaAdd.validate(req.body)
    if(error) return res.status(400).json(error.details[0].message)
    try {

        const team = await teamModel.findOne({name: req.body.name})
        if(team) return res.status(400).json("Ce nom est déjà pris")

        const hasTeam = await teamModel.findOne({adminId: req.userId})
        if(hasTeam) return res.status(400).json("Vous avez déjà une équipe")

        const newTeam = new teamModel({
            name: req.body.name,
            adminId: req.userId,
            adress: req.body.adress || "",
            website: req.body.website || "",
            members: [req.userId]
        })

        if(req.file){
            newTeam.profilePic = req.file.path
        }

        const teamCreated = await newTeam.save()
        res.json({teamCreated})

    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports.getTeams = async(req, res)=>{
    const teams = await teamModel.find()
    res.json({teams})
}
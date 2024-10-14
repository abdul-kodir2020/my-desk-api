const userModel = require("../models/user.model");
const bcrypt = require('bcrypt')
const joi = require('joi')
const jwt = require('jsonwebtoken')

const customMessages = {
    'string.base': '{{#label}} doit être une chaîne de caractères',
    'string.min': '{{#label}} doit avoir une longueur d\'au moins {{#limit}} caractères',
    'string.max': '{{#label}} doit avoir une longueur d\'au plus {{#limit}} caractères',
    'string.email': '{{#label}} doit être une adresse e-mail valide',
    'string.required': '{{#label}} est requis',
};

const schemaUser = joi.object(
    {
        firstname: joi.string().min(2).required().messages(customMessages),
        lastname: joi.string().min(7).required().messages(customMessages),
        email: joi.string().min(7).required().messages(customMessages),
        password: joi.string().min(8).required().messages(customMessages)
    }
)

module.exports.register = async(req, res)=>{
    try {
        const {error} = schemaUser.validate(req.body)
        if(error) return res.status(400).json({ error: error.details[0].message })

        const emailExist = await userModel.findOne({email: req.body.email})
        if(emailExist) return res.status(400).json({ error: 'Cet email appartient déjà à un utilisateur' })

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = new userModel({
            firstname: req.body.firstname.toLowerCase(),
            lastname: req.body.lastname.toLowerCase(),
            email: req.body.email.toLowerCase(),
            password: hashedPassword
        })

        const userSaved = await user.save()
        res.json({userSaved})
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports.login = async(req, res)=>{
    try {
        const emailExist = await userModel.findOne({email: req.body.email})
        if(!emailExist) return res.status(400).json({ error: 'Cette adresse email est introuvable' })

        const passwordVerification = await bcrypt.compare(req.body.password, emailExist.password)
        if(!passwordVerification) return res.status(400).json({ error: "Mot de passe incorrect" })

        const token = jwt.sign({userId: emailExist._id}, process.env.SECRET_KEY)

        res.json({token})
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports.getUser = async(req, res)=>{
    try {
        const user = await userModel.findById(req.userId)
        res.json({user})
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
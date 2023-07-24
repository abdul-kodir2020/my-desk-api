const userModel = require("../models/user.model");
const bcrypt = require('bcrypt')
const joi = require('joi')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const fs = require('fs')


const schemaUser = joi.object(
    {
        name: joi.string().min(7).required(),
        email: joi.string().min(7).required(),
        password: joi.string().min(8).required(),
        passwordRepeat: joi.string().min(8).required(),
        about: joi.string().min(15).required(),
        adress: joi.string().min(10).required(),
        website: joi.string().min(6).required(),
        role: joi.string().min(2).required(),
    }
)

module.exports.register = async(req, res)=>{
    try {
        const {error} = schemaUser.validate(req.body)
        if(error) return res.status(400).json(error.details[0].message)

        const emailExist = await userModel.findOne({email: req.body.email})
        if(emailExist) return res.status(400).json('Cet email appartient déjà à un utilisateur')

        if(req.body.password !== req.body.passwordRepeat) return res.status(400).json('Les mots de passes doivent être les mêmes')

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = new userModel({
            name: req.body.name.toLowerCase(),
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
            about: req.body.about.toLowerCase(),
            adress: req.body.adress.toLowerCase(),
            website: req.body.website,
            role: req.body.role.toLowerCase()
        })

        if(req.file){
            user.profilePic = req.file.path
        }

        const userSaved = await user.save()
        res.json({userSaved})
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports.login = async(req, res)=>{
    try {
        const emailExist = await userModel.findOne({email: req.body.email})
        if(!emailExist) return res.status(400).json('Cette adresse email est introuvable')

        const passwordVerification = await bcrypt.compare(req.body.password, emailExist.password)
        if(!passwordVerification) return res.status(400).json("Mot de passe incorrect")

        const token = jwt.sign({userId: emailExist._id}, process.env.SECRET_KEY)
        // {
        //     'expiresIn': '2h'
        // }

        res.json({token})
    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports.getUser = async(req, res)=>{
    try {
        const user = await userModel.findById(req.userId)
        res.json({user})
    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports.passwordForgot = async(req, res)=>{
    try {
        if (!req.body.code) {
            const emailExist = await userModel.findOne({email: req.body.email})
            if(!emailExist) return res.status(400).json('Cette adresse email est introuvable')
            console.log(req)
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth:{
                    user: 'mounirouabdul40@gmail.com',
                    pass: 'dkmvuudtlfsxatds'
                }
            })
        
            const text = 'Code de récupération : 8562'
        
            const mailOptions = {
                from: 'mounirouabdul40@gmail.com',
                to: req.body.email,
                subject: "Récupération de mot passe ( DESK )",
                text: text
            }


            await transporter.sendMail(mailOptions, (error, info)=>{
                if(error){
                    res.status(400).json({error})
                }else{
                    res.json({message: 'email bien envoyé'})
                }
            })
        }else{
            if(req.body.code !== '8562') return res.status(400).json({message: "Code éronné"})

            if(req.body.password !== req.body.passwordRepeat) return res.status(400).json({message: 'Les mots de passes doivent être les mêmes'})

            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            await userModel.findOneAndUpdate({email: req.body.email}, {password: hashedPassword})
            res.json({message: "Mot de passe modifié"})
        }
        
    } catch (error) {
        res.status(400).json({message: "L'envoi a échoué"})
    }
    
}

module.exports.updateUser = async(req, res)=>{
    try {
        const userExist = await userModel.findOne({_id: req.userId})
        if(!userExist) return res.status(400).json('Cet utilisateur est introuvable')

        if(req.file){
            fs.unlink(userExist.profilePic,  (err) => {
                if (err) {
                  console.error(err);
                  throw new Error('Erreur lors de la suppression du fichier');
                }
            })

            await userModel.findByIdAndUpdate(userExist, {profilePic: req.file.path})
        }else{
            await userModel.findByIdAndUpdate(userExist, req.body)
        }

        const user = await userModel.findOne({_id: req.userId})
        res.json({user})
    } catch (error) {
        res.status(400).json({error})
    }
}

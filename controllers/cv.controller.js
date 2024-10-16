const joi = require("joi");
const CV = require("../models/cv.model");
const fs = require('fs')

const customMessages = {
    'string.base': '{{#label}} doit être une chaîne de caractères',
    'string.min': '{{#label}} doit avoir une longueur d\'au moins {{#limit}} caractères',
    'string.max': '{{#label}} doit avoir une longueur d\'au plus {{#limit}} caractères',
    'string.email': '{{#label}} doit être une adresse e-mail valide',
    'string.required': '{{#label}} est requis',
};

const schemaCV = joi.object(
    {
        name: joi.string().min(5).required().messages(customMessages),
        email: joi.string().email().min(7).required().messages(customMessages),
        phone: joi.string().min(8).messages(customMessages)
    }
)

module.exports.addCv = async (req, res) => {
    try {
        const cv = await CV.findOne({userId : req.userId})
        if (cv) return res.status(400).json({error : "Cet utilisateur possède déjà un cv"})

        const body = req.body
        
        const {error} = schemaCV.validate(req.body)
        if(error) return res.status(400).json({ error: error.details[0].message })

        body.userId = req.userId
        
        if (req.file) {
            body.picture = req.file.path
        }

        const newCV = new CV(body);
        await newCV.save();
        res.status(201).json({newCV});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports.getCvs = async (req, res) => {
    try {
        const cvs = await CV.find({visible: true});
        res.status(200).json({cvs});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports.getCv = async (req, res) => {
    try {
        const cv = await CV.findById(req.params.id);
        if (!cv) return res.status(404).json({ error: "Ce cv n'existe pas" });

        res.status(200).json({cv});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports.getCvByUserId = async (req, res) => {
    try {
        const cv = await CV.findOne({userId : req.userId});
        if (!cv) return res.status(450).json({ error: "Cet Utilisateur n'a pas de cv" });

        res.status(200).json({cv});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports.updateCv = async(req,res) => {
    try {
        const cv = await CV.findById(req.params.id)
        if (!cv) return res.status(400).json({error : "Ce cv n'existe pas"}) 
        
        const body = req.body

        if (req.file) {
            if(cv.picture) unlikePic(cv.picture)
            body.picture = req.file.path
        }

        await CV.findByIdAndUpdate(
            req.params.id,
            body,
            {new: true, timestamps: false}
        )

        const cvUpdated = await CV.findById(req.params.id);

        res.json({cvUpdated})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const unlikePic = (path) =>{
    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
          console.log('File does not exist');
        } else {
            fs.unlink(path,  (err) => {
                if (err) {
                  throw new Error('Erreur lors de la suppression du fichier');
                }
            })
        }
    });
}

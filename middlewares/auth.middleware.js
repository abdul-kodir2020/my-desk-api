const jwt = require("jsonwebtoken")

const verifyToken = async(req,res,next) =>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        const tokenVerrification = jwt.verify(token, process.env.SECRET_KEY)
        req.userId = tokenVerrification.userId

        next()
    } catch (error) {
        return res.status(400).json("Vous n'avez pas le droit")
    }
    
}

module.exports = verifyToken
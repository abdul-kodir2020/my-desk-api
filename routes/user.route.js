const { register, login, getUser } = require('../controllers/user.controllers')
const verifyToken = require('../middlewares/auth.middleware')
const router = require('express').Router()


router.post('/register', register)
router.post('/login',login)
router.get('/',verifyToken,getUser)
// router.post('/',verifyToken,upload.single('image'),updateUser)
// router.post('/password-forgot',passwordForgot)

module.exports = router
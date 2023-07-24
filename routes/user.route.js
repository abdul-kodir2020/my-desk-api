const { register, login, passwordForgot, getUser, updateUser } = require('../controllers/user.controllers')
const upload = require('../middlewares/upload.middleware')
const verifyToken = require('../middlewares/auth.middleware')
const router = require('express').Router()




router.post('/register', upload.single('image'), register)
router.post('/login',login)
router.get('/',verifyToken,getUser)
router.post('/',verifyToken,upload.single('image'),updateUser)
router.post('/password-forgot',passwordForgot)

module.exports = router
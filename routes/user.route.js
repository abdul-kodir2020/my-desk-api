const { register, login, passwordForgot, getUser } = require('../controllers/user.controllers')
const upload = require('../middlewares/upload.middleware')
const verifyToken = require('../middlewares/auth.middleware')
const router = require('express').Router()




router.post('/register', upload.single('image'), register)
router.post('/login',login)
router.post('/',verifyToken,getUser)
router.post('/password-forgot',passwordForgot)

module.exports = router
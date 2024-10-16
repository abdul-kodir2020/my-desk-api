const upload = require('../middlewares/upload.middleware')
const verifyToken = require('../middlewares/auth.middleware')
const { getCv, getCvs, addCv, updateCv, getCvByUserId} = require('../controllers/cv.controller')
const router = require('express').Router()

router.get('/:id',verifyToken ,getCv)
router.get('/user/me',verifyToken ,getCvByUserId)
router.get('/', getCvs)
router.post('/',verifyToken ,upload.single('image'), addCv)
router.put('/:id',verifyToken ,upload.single('image'), updateCv)

module.exports = router

const { addFile, getFiles, deleteFile } = require('../controllers/file.controller')
const verifyToken = require('../middlewares/auth.middleware')
const upload = require('../middlewares/upload.middleware')

const router = require('express').Router()

router.post('/',upload.single('file'),verifyToken, addFile)
router.get('/:projectId', verifyToken, getFiles)
router.delete('/:id', verifyToken, deleteFile)


module.exports = router
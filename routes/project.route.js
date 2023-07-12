const { getProjects, getOneProject, deleteProject, addProject, updateProject } = require('../controllers/project.controller')
const verifyToken = require('../middlewares/auth.middleware')

const router = require('express').Router()

router.get('/',verifyToken, getProjects)
router.get('/:id', verifyToken,getOneProject)
router.delete('/:id',verifyToken, deleteProject)
router.put('/:id',verifyToken,updateProject)
router.post('/', verifyToken,addProject)

module.exports = router
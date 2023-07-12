const { getTasks, addTask, getOneTask, deleteTask, updateTask } = require('../controllers/task.controller')
const verifyToken = require('../middlewares/auth.middleware')

const router = require('express').Router()

router.get('/all/:projectId',verifyToken, getTasks)
router.get('/:id', verifyToken,getOneTask)
router.delete('/:id',verifyToken, deleteTask)
router.put('/:id', verifyToken,updateTask)
router.post('/', verifyToken,addTask)

module.exports = router
const { addTeam, getTeams } = require('../controllers/team.controller')
const verifyToken = require('../middlewares/auth.middleware')
const upload = require('../middlewares/upload.middleware')

const router = require('express').Router()

router.post('/', upload.single('image'), verifyToken, addTeam)
router.get('/', verifyToken, getTeams)

module.exports = router
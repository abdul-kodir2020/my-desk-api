const express = require('express')
const app = express()
const cors = require('cors')

const dotenv = require('dotenv')
const dbConnect = require('./config/db')
const multer = require('multer')
dotenv.config()

dbConnect()

//middlewares
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  // Handle the uploaded file
  console.log(req.file);
  res.send('File uploaded!');
});

app.use('/api/task', require('./routes/task.route'))
app.use('/api/user', require('./routes/user.route'))
app.use('/api/project', require('./routes/project.route'))
app.use('/api/file', require('./routes/file.route'))
app.use('/api/team', require('./routes/team.route'))
app.use('/uploads', express.static('uploads'))

app.listen(process.env.PORT,()=>{
    console.log("serveur démarré")
})

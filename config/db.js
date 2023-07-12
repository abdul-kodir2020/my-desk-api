const mongoose = require('mongoose')

const dbConnect = async()=>{

    await mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log('db connectée'))
    .catch((err)=>console.log(err))
}

module.exports = dbConnect
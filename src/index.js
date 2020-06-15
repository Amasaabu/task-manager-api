const express = require('express')
mongoose = require('mongoose')


require('./db/mongoose') //ensures mongoose connect to the database

// loading models
// no longer neccesary
// const User = require('./models/user') 
// const Task = require('./models/task')

//requiring routes
const userRouter= require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

const multer = require('multer')






app.use(express.json())


// app.use((req,res,next)=>{
//     if(req.method === 'GET'){
//         res.send('GET REQUEST DISABLED')
//     } else {
//         next()
//     }
    
// })

// app.use((req, res, next)=>{
//         res.status(503).send('UNDER MAINTANANCE')
    
// })

//loading routes
app.use(userRouter)
app.use(taskRouter)






app.listen(port, ()=>{
    console.log('server is up on port ' + port)
})

const Task = require('./models/task')
const User = require('./models/user')

// const main = async () =>{
//     // const task = await Task.findById('5ee1f75dc3651b24e98b122e')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     const user = await User.findById('5ee1f64ceafb34d8208f7d75')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)

// }
// main()


const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_DATABASE ,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})





// const me = new User({
//     name: '  Amasa  ',
//     email: '  mic@mead.io  ',
//     password: '1234567Password'
// })

// me.save().then((me)=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('Error', error)
// })



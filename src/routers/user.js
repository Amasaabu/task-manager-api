const express = require('express')
const User = require('../models/user')
const auth = require('../middlware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcome, sendemaildelete} = require('../emails/account')

const router = new express.Router()


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcome(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })

    } catch (e) {
        res.status(400).send(e)
    }



    // user.save().then(()=>{
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    //     // res.send(e)
    // })
})

router.patch('/users/me', auth,  async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedupdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update)=>{
        return allowedupdates.includes(update)
    })
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid OPeration'})
    }


    try {
        const user = await req.user

        updates.forEach((update)=>{
            user[update] = req.body[update]
        })
        await user.save()

        if(!user) {
            return res.status(404).send()
        }

        res.send(user)

    } catch(e) {
        res.status(500).send()

    }
})

router.post('/users/login', async (req, res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch(e) {
        req.status(500).send()
    }
})

router.post('/users/logoutall', auth, async(req,res)=>{
    try {
        req.user.tokens = []
        // req.user.tokens = req.user.tokens.forEach((token)=>{
        //     return token = []
        // })

        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})


router.get('/users/me', auth , async (req, res) => {
    res.send(req.user)


    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})


router.delete('/user/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user.id)

        // if (!user) {
        //     return res.status(404).send()
        // }

        await req.user.remove()
        sendemaildelete(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})
const upload = multer ({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload a valid image file')) 
        }

        cb(undefined, true)
    
    }
})
const errorMiddlewar = (req, res, next) => {
    throw new Error('from middle weaer')
}
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res)=>{ 
    const buffer = await sharp(req.file.buffer).resize({width: 250, height:250}).png().toBuffer()

    req.user.avatar=buffer
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, upload.single('avatar'), async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch(e) {
        res.status(404).send()
    }
})


module.exports = router

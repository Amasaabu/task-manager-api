const express = require('express')

const router = new express.Router()

const Task = require('../models/task')
const auth = require('../middlware/auth')

router.delete('/task/:_id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({owner: req.user.id, _id: req.params._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})



router.patch('/Task/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const validdatas = ["Completed", "description"]

    const isValidOperation = updates.every((validdata) => {
        return validdatas.includes(validdata)
    })

    if (!isValidOperation) {
        return res.status(400).send('input valid data to be updated')
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        // const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).send('Task not Updated')
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})



router.post('/Task', auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user.id
    })
    try {
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send()
    }

    // task.save().then(()=>{
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

router.get('/Tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.Completed) {
        match.Completed = req.query.Completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            },
        }).execPopulate()
        // const tasks = await Task.find({owner : req.user._id})
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
    // Task.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

router.get('/Tasks/:id', auth, async (req, res) => {
    const _id = req.params.id


    try {

        const task = await Task.findOne({_id, owner:req.user._id})
        
        if(!task) {
            return res.status(404).send()
        }
        return res.send(task)
    } catch (e) {
        res.status(400).send()
    }

    // if (!mongoose.Types.ObjectId.isValid(_id)) {
    //     res.status(404).send()
    // } else{

    // Task.findById(_id).then((tasks)=>{
    //     if (!tasks){
    //         return res.status(404).send()
    //     }
    //     res.send (tasks)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
    // }
})




module.exports = router
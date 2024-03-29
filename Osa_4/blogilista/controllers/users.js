const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
//4.17
usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    res.json(users)
})
//4.15
usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body
    //4.16
    const existingUser = await User.findOne({ username })
    if (existingUser || password.length < 3) {
        return res.status(400).json({
            error: 'username or password is not valid'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })
    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

module.exports = usersRouter
const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()

//api/users
router.get(
    '/users',
    [],
    async (request, response) => {
        try {
            const users = await User.find()
            response.status(201).json(users)
        } catch (e) {
            response.status(500).json({
                message: 'Error users get'
            })
        }
    })

module.exports = router

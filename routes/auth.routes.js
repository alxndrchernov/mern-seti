const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()

//api/auth/register
router.post(
    '/register',
    [
        check('email', 'error email').isEmail(),
        check('password', 'error password, min length password 6 symbols').isLength({min: 6})
    ],
    async (request, response) => {
        try {
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                return response.status(400).json({
                    errors: errors.array(),
                    message: 'something is wrong'
                })
            }
            const {email, password} = request.body
            const candidate = await User.findOne({email})
            if (candidate) {
                return response.status(400).json({
                    message: 'Такой пользователь сущестсвует'
                })
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({email, password: hashedPassword})
            await user.save()
            response.status(201).json({message: 'user saved'})
        } catch (e) {
            response.status(500).json({
                message: 'Ошибка при регистрации'
            })
        }
    })

router.post(
    '/login',
    [
        check('email', 'error email').isEmail(),
        check('password', 'error password, min length password 6 symbols').exists()
    ],
    async (request, response) => {
        try {
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                return response.status(400).json({
                    errors: errors.array(),
                    message: 'something is wrong'
                })
            }
            const {email, password} = request.body
            const user = await User.findOne({email})
            if (!user) {
                return response.status(400).json({
                    message: 'User not found'
                })
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return response.status(400).json({
                    message: 'Error password'
                })
            }
            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            )
            response.json({
                token,
                userId: user.id,
                email: user.email,
                avatar: user.avatar
            })
        } catch (e) {
            response.status(500).json({
                message: 'Некорректные данные'
            })
        }
    })
/*router.get('/users',
    (req, res,) => {
        try {
            User.find({}, {}, function (err, users) {
                res.json({users})
            })

        } catch (e) {
            res.status(500).json({
                message: 'Что то пошло не так'
            })
        }
    })*/

module.exports = router
const express = require('express');
const router = express.Router();
const passport = require('../../db/auth/passport');
const { body, validationResult } = require('express-validator');
const createError = require('http-errors');
const logger = require('../utilities/logger');

const { User } = require('../../db/database').models

const { authCheck, routeErrorsScript, validationErrorsOutputScript } = require('../utilities/generalUtilities');

const bcrypt = require('bcrypt');


router.get('/profile', authCheck, (req, res, next) => {
    res.status(200).json(req.user);
})

router.post('/register',
    [
        body('firstname')
            .notEmpty().withMessage(`First Name cannot be empty`),
        body('lastname')
            .notEmpty().withMessage(`Last name cannot be empty`),
        body('password')
            .notEmpty().withMessage(`Password cannot be empty`)
            .isStrongPassword().withMessage('Weak password, please consider at least 8 charachters, at least 1 lower case and one uppercase letters, at least one number and at least 1 special character.'),
        body('passwordCheck')
            .notEmpty().withMessage(`Confirm Password cannot be empty`)
            .custom((password, { req }) => password === req.body.password).withMessage('Password & Confirm password do not match'),
        body('email')
            .notEmpty().withMessage(`Email cannot be empty`)
            .trim().normalizeEmail()
            .isEmail().withMessage(`Email must be an valid email address`),
    ],
    async (req, res, next) => {

        const { firstname, lastname, email, password, passwordCheck } = req.body;

        validationErrorsOutputScript(req);

        const user = await User.findOne(
            {
                where: {
                    email,
                }
            }
        )

        if (user) {
            return next(
                createError(400, `User with the ${email} is already registered.`)
            )
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 12)
            await User.create({
                firstname,
                lastname,
                email,
                password: hashedPassword,
            });
            res.redirect('/users/login')
        } catch (error) {
            const errMsg = 'Error occured while registering a new user.'
            return next(routeErrorsScript(error, errMsg));
        }
    });

router.put('/update', authCheck,
    [
        body('firstname')
            .notEmpty().withMessage(`First Name cannot be empty`),
        body('lastname')
            .notEmpty().withMessage(`Last name cannot be empty`),
        body('email')
            .notEmpty().withMessage(`Email cannot be empty`)
            .trim().normalizeEmail()
            .isEmail().withMessage(`Email must be an valid email address`),
        body('password')
            .notEmpty().withMessage(`Password cannot be empty`),
        body('newPassword')
            .optional({ values: 'falsy' })
            .notEmpty().withMessage(`New Password cannot be empty`)
            .isStrongPassword().withMessage('Weak New password, please consider at least 8 charachters, at least 1 lower case and one uppercase letters, at least one number and at least 1 special character.')
            .custom((newPassword, { req }) => newPassword !== req.body.password)
            .withMessage('New password must be different from password'),
        body('newPasswordCheck')
            .custom((newPasswordCheck, { req }) => {
                if (req.body.newPassword && !newPasswordCheck) {
                    throw createError(400, 'Confirm New Password cannot be empty')
                }
                return newPasswordCheck === req.body.newPassword
            })
            .withMessage('New Password & Confirm New Password do not match'),
    ],
    async (req, res, next) => {

        const { firstname, lastname, email, password, newPassword, newPasswordCheck } = req.body;

        validationErrorsOutputScript(req);

        try {
            const user = await User.findByPk(req.user.id);

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return next(createError(
                    401,
                    'Incorrect current password'
                ))
            }

            const userData = newPassword ?
                {
                    firstname,
                    lastname,
                    email,
                    password: await bcrypt.hash(newPassword, 12),
                } :
                {
                    firstname,
                    lastname,
                    email,
                };

            await user.update(userData);
            res.redirect('/users/profile')

        } catch (error) {
            const errMsg = 'Error occured while update of the user profile.'
            return next(routeErrorsScript(error, errMsg));
        }
    });

router.get('/login', (req, res, next) => {
    res.redirect('/static/index.html');
})

router.post('/login',
    passport.authenticate(
        'local',
        {
            failureRedirect: '/users/logout',
            failureMessage: true,
        }
    ),
    (req, res, next) => {
        console.log('Authentication succeded!')
        res.redirect('/user/profile');
    }
)


router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(createError(
                500,
                "Error occurred during logging out"
            ))
        };
        req.session.destroy(sessionDestError => {
            if (sessionDestError) {
                return next(
                    createError(
                        500,
                        `Error occurred during "session destroy"`
                    )
                )
            }
            res.redirect('/users/login')
        });
    });
});

module.exports = router;    
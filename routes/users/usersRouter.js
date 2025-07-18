const express = require('express');
const router = express.Router();
const passport = require('../../db/auth/passport');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

const { User } = require('../../db/database').models

const { body } = require('express-validator');
const {
    bodyUserPasswordCheckValidator,
    bodyUserEmailValidator,
    bodyAnyNameValidator,
    anyPasswordValidator,
} = require('../utilities/validations');

const { authCheck,
    routeErrorsScript,
    validationErrorsOutputScript,
    updateOutputObjectGen } = require('../utilities/generalUtilities');

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

router.post('/register',
    [
        bodyAnyNameValidator('firstname'),
        bodyAnyNameValidator('lastname'),
        anyPasswordValidator('password'),
        bodyUserPasswordCheckValidator(),
        bodyUserEmailValidator(),
    ],
    async (req, res, next) => {

        const { firstname, lastname, email, password } = req.body;

        validationErrorsOutputScript(req);

        try {
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

router.get('/profile', authCheck,
    (req, res, next) => {
        res.status(200).json(req.user);
    })

router.put('/update', authCheck,
    [
        bodyAnyNameValidator('firstname').optional({ values: 'falsy' }),
        bodyAnyNameValidator('lastname').optional({ values: 'falsy' }),
        bodyUserEmailValidator().optional({ values: 'falsy' }),
        bodyAnyNameValidator('password'),
        anyPasswordValidator('newPassword')
            .optional({ values: 'falsy' })
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

        const { firstname, lastname, email, password, newPassword } = req.body;

        validationErrorsOutputScript(req);

        const outputObject = updateOutputObjectGen({ firstname, lastname, email, newPassword })
        console.log("Output object:", outputObject);

        try {
            const user = await User.findByPk(req.user.id);

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return next(createError(
                    401,
                    'Incorrect current password'
                ))
            }
            if (newPassword) {
                outputObject.password = await bcrypt.hash(newPassword, 12)
            }
            console.log("Hashed Output object:", outputObject);

            await user.update(outputObject);
            res.redirect('/users/profile')

        } catch (error) {
            const errMsg = 'Error occured while update of the user profile.'
            return next(routeErrorsScript(error, errMsg));
        }
    });

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
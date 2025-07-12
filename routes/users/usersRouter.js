const express = require('express');
const router = express.Router();
const passport = require('../../db/auth/passport');
const logger = require('../utilities/logger');

const { User } = require('../../db/database').models
const { authCheck, routeErrorsScript } = require('../utilities/utilities');

const bcrypt = require('bcrypt');


router.get('/profile', authCheck, (req, res, next) => {
    res.status(200).json(req.user);
})

router.post('/register', async (req, res, next) => {

    const { firstname, lastname, email, password, passwordCheck } = req.body;

    if (password != passwordCheck) {
        logger.info(`Password and Re-enter password do not match at "${req.path}" route`)
        res.status(409).json({ msg: 'Password and Re-enter password do not match.' });
        return;
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
        routeErrorsScript(next, error, 500, errMsg);
        return;
    }
});

router.put('/update', authCheck, async (req, res, next) => {

    const { firstname, lastname, email, password, newPassword, newPasswordCheck, status } = req.body;

    try {
        const user = await User.findByPk(req.user.id);

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            logger.info(`Incorrect current password at "${req.path}" for user ID: ${req.user.id}`)
            res.status(401).json({ msg: 'Incorrect current password' });
            return
        }
        if (newPassword !== newPasswordCheck) {
            logger.info(`New password does not match new password check at "${req.path}" for user ID: ${req.user.id}`);
            res.status(409).json({ msg: 'New password does not match new password check' })
            return
        }

        const userData = newPassword ?
            {
                firstname,
                lastname,
                email,
                password: await bcrypt.hash(newPassword, 12),
                status
            } :
            {
                firstname,
                lastname,
                email,
                status
            };

        Object.keys(userData).forEach(key => {
            if (user[key] !== userData[key]) {
                user[key] = userData[key]
            }
        })
        await user.save();
        res.redirect('/users/profile')

    } catch (error) {
        const errMsg = 'Error occured while update of the user profile.'
        routeErrorsScript(next, error, 500, errMsg);
        return;
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
        if (err) res.send(err);
        req.session.destroy();
        res.redirect('/users/login')
    });
});

module.exports = router;    
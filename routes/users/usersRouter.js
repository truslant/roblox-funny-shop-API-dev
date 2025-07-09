const express = require('express');
const router = express.Router();
const passport = require('../../db/auth/passport');

const { User } = require('../../db/database').models
const { authCheck } = require('../utilities/utilities');

const bcrypt = require('bcrypt');

router.post('/register', async (req, res, next) => {

    const { firstname, lastname, email, password, passwordCheck } = req.body;

    if (password != passwordCheck) {
        res.redirect('/register');
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
        res.redirect('/')
    } catch (error) {
        next(error);
    }
});

router.put('/update', authCheck, async (req, res, next) => {

    const { firstname, lastname, email, password, newPassword, newPasswordCheck } = req.body;

    try {
        const user = await User.findByPk(req.user.id);

        const match = await bcrypt.compare(password, user.password);

        if (match && newPassword == newPasswordCheck) {

            const hashedPassword = await bcrypt.hash(newPassword, 12);

            const userData = { firstname, lastname, email, password: hashedPassword };

            Object.keys(userData).forEach(key => {
                if (user[key] !== userData[key]) {
                    user[key] = userData[key]
                }
            })

            await user.save();
            res.redirect('/')
        }
        res.redirect('/');
    } catch (error) {
        next(error);
    }

});

router.post('/login',
    passport.authenticate(
        'local',
        {
            failureRedirect: '/users/logout'
        }
    ),
    (req, res, next) => {
        console.log('Authentication succeded!')
        res.redirect('/');
    }
)

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) res.send(err);
        req.session.destroy();
        res.redirect('/users/login')
    });
});

router.get('/login', (req, res, next) => {
    res.redirect('/static/index.html');
})

module.exports = router;    
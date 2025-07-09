const passport = require('passport');
const PassportLocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');

const { User } = require('../database').models;

passport.use(
    new PassportLocalStrategy(async (username, password, done) => {
        try {
            // console.log('User name:', username);
            // console.log('Password:', password);
            // console.log('Password type:', typeof (password));

            const user = await User.findOne({
                where: {
                    email: username
                }
            })

            // console.log('User password: ', user.password)

            if (!user) {
                console.error('User not found');
                return done(null, false, { message: 'User not found' })
            }

            const passMatch = await bcrypt.compare(password, user.password)

            if (!passMatch) {
                console.error('Password incorrect');
                return done(null, false, { message: 'Incorrect password' })
            }

            return done(null, user)
        } catch (error) {
            done(error)
        }
    })
);

passport.serializeUser((user, done) => {
    return done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})

module.exports = passport;
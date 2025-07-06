const passport = require('passport');
const PassportLocalStrategy = require('passport-local').Strategy;

const { User } = require('../database').models;

passport.use(
    new PassportLocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({
                where: {
                    email: username
                }
            })
            if (!user) {
                return done(null, false, { message: 'User not found' })
            }
            if (user.password !== password) {
                return done(null, user, { message: 'Incorrect password' })
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
const passport = require('passport');
const PassportLocalStrategy = require('passport-local').Strategy;
const logger = require('winston')

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
                logger.info(`Passportjs local strategy authentication failure - User not found for username:`, username);
                return done(null, false, { message: 'Incorrect User or Password' })
            }

            const passMatch = await bcrypt.compare(password, user.password)

            if (!passMatch) {
                logger.info(`Passportjs local strategy authentication failure - Incorrect passport "${passport}" attempted for username "${username}"`);
                return done(null, false, { message: 'Incorrect User or Password' })
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
const express = require('express');
const router = express.Router();

const { User } = require('../../db/database').models;

const { routeErrorsScript,
    validationErrorsOutputScript,
    updateOutputObjectGen } = require('../utilities/generalUtilities');

const { isAdmin,
    modelInstanceExistanceCheck } = require('../utilities/modelUtilities');

const {
    anyFieldIdValidator,
    bodyUserEmailValidator,
    bodyAnyNameValidator,
    anyEnumValidateor, } = require('../utilities/validations');

const { validUserStatuses } = require('../../variables/projectwideVariables')

router.get('/profile/:userId', isAdmin,
    [
        anyFieldIdValidator('userId')
    ],
    async (req, res, next) => {

        const { userId } = req.params;

        validationErrorsOutputScript(req);

        try {
            const user = await modelInstanceExistanceCheck(userId, User);
            res.status(200).json(user);
        } catch (error) {
            errMsg = `No User found with ID: ${userId}`
            return next(
                routeErrorsScript(error, errMsg)
            );
        }
    })

router.put('/updateProfile', isAdmin,
    [
        anyFieldIdValidator('userId'),
        bodyAnyNameValidator('firstname').optional({ values: 'falsy' }),
        bodyAnyNameValidator('lastname').optional({ values: 'falsy' }),
        bodyUserEmailValidator().optional({ values: 'falsy' }),
        anyEnumValidateor('status', validUserStatuses).optional({ values: 'falsy' }),
    ],
    async (req, res, next) => {

        const { userId, firstname, lastname, email, status } = req.body;

        validationErrorsOutputScript(req);

        const outputObject = updateOutputObjectGen({ userId, firstname, lastname, email, status })

        try {
            const user = await modelInstanceExistanceCheck(userId, User);
            await user.update(outputObject);
            res.redirect(`/admin/users/profile/${userId}`);
        } catch (error) {
            const errMsg = `Error while updating profile data for user ID ${userId}`;
            return next(routeErrorsScript(error, errMsg));
        }
    });

module.exports = router;

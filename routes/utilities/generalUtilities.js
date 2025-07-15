const createError = require('http-errors')
const { validationResult } = require('express-validator')

const authCheck = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next(createError(401, 'You must be authenticated to access this page'))
    }
    next();
}

const modelMethodsDisplay = (modelInstance) => {
    console.log(`${modelInstance.constructor.name} methods`, Object.getOwnPropertyNames(Object.getPrototypeOf(modelInstance)));
}


const routeErrorsScript = (error, errMessage) => {
    console.log('routeErrorScript triggered')
    if (error.name === 'SequelizeValidationError') {
        error.status = 400;
        return error;
    }
    if (error.message && error.status) {
        return error;
    }
    return createError(error.status || 500, error.message || errMessage);
}

const validCategoriesToString = (validCategoryArray) => (
    validCategoryArray.reduce((accum, curvalue, index) => {
        return `${accum}, ${curvalue}`
    })
)

const validationErrorsOutputScript = (req) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        throw createError(400,
            'User Input Validation error(s), see the details:',
            { details: validationErrors.array().map(error => error.msg) }
        )
    }
}


module.exports = { authCheck, modelMethodsDisplay, routeErrorsScript, validCategoriesToString, validationErrorsOutputScript };
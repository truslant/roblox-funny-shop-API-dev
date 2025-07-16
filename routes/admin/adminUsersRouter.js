const express = require('express');
const router = express.Router();

const { } = require('../utilities/generalUtilities');
const { isAdmin } = require('../utilities/modelUtilities');
const { } = require('../utilities/validations');

router.get('/', (req, res, send) => {
    res.send(`Admin User Route: ${req.path}`);
})

router.put('/updateProfile', isAdmin,
    [

    ],
    async (req, res, next) => {
        
    });

module.exports = router;

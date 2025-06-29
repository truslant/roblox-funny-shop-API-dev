const express = require('express');
const router = express.Router();

const userRouter = require('./users/usersRouter');

router.get('/', (req,res,next)=>{
    res.json({msg: 'root route - index'})
});

router.use('/users', userRouter);

module.exports = router;
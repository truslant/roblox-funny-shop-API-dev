const express = require('express');
const router = express.Router();

router.get('/', (req,res,next)=>{
    res.json({msg: 'User route - index'})
})

module.exports = router;
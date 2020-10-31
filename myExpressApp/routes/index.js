const express = require('express');
const router = express.Router();



const upload=require('./upload.routes');

router.use('/test', upload);

module.exports = router;

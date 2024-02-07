const express = require('express');
const router = express.Router();
const authorcontroller = require('../models/authorcontrollers');
const blogcontroller = require('../models/blogcontroller');
const middleWare = require('../middleware/middleware');

router.post('/create-blog', blogcontroller.createblog)
router.get('/get-blog', middleWare.loginCheck, blogcontroller.getblog)
// router.put('/update-blog/:blogId', middleWare.loginCheck, blogcontroller.updateblogs )
router.put('/blogs/:blogId', middleWare.loginCheck, blogcontroller.updateDetails)
router.delete('/blogs/:blogId', middleWare.loginCheck, blogcontroller.deleteBlogById)
//router.delete('/delete-blog/:blogId', blogcontroller.deleteblog)

router.post('/create-author', authorcontroller.createauthor)
router.get('/get-author', authorcontroller.getauthor)
router.delete('/delete-author', authorcontroller.deleteauthor)
router.post('/login-author', authorcontroller.loginauthor)

module.exports = router 

//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JJZCI6IjY1YmUwYjcyNGRmNWFlNzhkMzhmOTU3OCIsImlhdCI6MTcwNzIzNDYzN30.SnFzQ2MNjPWU-EXyVywlbne3QeJ6oU_4eQJfaednuzY"



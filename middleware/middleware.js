
const authormodel = require("../models/authormodel");
const blogmodel = require("../models/blogsmodel");

const jwt = require("jsonwebtoken");

let secreteKey = 'group-21';


const loginCheck = async function(req, res, next) {

    try{
       let token = req.headers["x-api-key"] 

       if (!token) return res.status(404).send({status: false, message:"token must be required, please enter token" })

       let decoded = await jwt.decode(token, secreteKey);

       if (!decoded) return res.status(403).send({status: false, message: "invalid token"})

       req.authorId = decoded.authorId 

       next()
    }

    catch(err){
        res.status(500).send({message: err})
    }
}


module.exports.loginCheck = loginCheck; 


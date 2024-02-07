const { all } = require('..');
const jwt = require("jsonwebtoken")
const authormodel = require('../models/authormodel');

let secreteKey = 'group-21';

const isEmpty = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidName = function (name) {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(name)
};

const isValidPassword = function (password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
}

const createauthor = async function(req, res) {
     
    try{

        let author = req.body 

        if(Object.keys(author).length == 0) 
        return res.status(400).send({status: true, message: "fields are mandatory"});

        let {fname, lname, title, email, password} = author

        if(!isEmpty (fname)){
            return res.status(400).send({status: false, message: "first name is required"})
        }
        if(!isEmpty(lname)){
            return res.status(400).send({status: false, message: "last name is required"})
        }
        if (!isEmpty(title)){
            return res.status(400).send({status: false, message: "title is required"})
        } 
        if (!isEmpty(email)){
            return res.status(400).send({status: false, message: "email is required"})
        }
        if (!isEmpty(password)){
            return res.status(400).send({status: false, message: "password is required"})
        }
       if(!isValidName(fname)){
        return res.status(400).send({status: false, message: "name is required"})
       }
       if (!isValidName(lname)){
        return res.status(400).send({status: false, message: "last name is required"})
       }
       if (!isValidPassword(password)){
        return res.status(400).send({status: false, message: "password is incorrect! it must contain 8 len and a capital, a small, a special char, and a number"})
       }
       const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
       const validmail = email.match(pattern)
       if(!validmail){
        return res.status(400).send({status: false, message: "enter a valid email."})
       }
       const mail = await authormodel.findOne({ email: email})
        if (mail)
            return res.status(400).send({ status: false, message: "EmailId Already Registered " })
    

            const create = await authormodel.create(author)
        return res.status(201).send({ status: true, message: "Author Created Successfully", data: create })
    
        } 
    

    catch(err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const getauthor = async function(req, res){
    let allauthors = await authormodel.find({fname: ""})
    console.log(allauthors)


if (allauthors.length > 0) res.send({msg: allauthors, condition: true})
else res.send({msg: "No authors found", condition: false})
res.send({msg: allauthors})
}

const deleteauthor = async function(req, res){
    const delauth = req.params.authId;
    const findauth = await authormodel.findById({_id: params})

    if (!findauth){
        return res.status(404).send({status: false, message: 'No auth found'})
    }
    else if(findauth.$isDeleted == true) {
       return res.status(400).send({status: false, messgae: 'auth has been deleted'})
    }
    else{
        const deletedata = await authormodel.findOneAndUpdate({
      //      {_id: params}, {set: {$isDeleted: true, deletedAt: new Date()} }
        } ,{new: true}) 

        return res.status(200).send({status: true, message: "auth deleted successfully", data: deletedata})
    };
}

const loginauthor = async function (req, res) {
    try {
      let userName = req.body.email;
      if (!userName)
        return res
          .status(400)
          .send({ status: false, msg: 'please enter emailId' });
  
      let password = req.body.password;
      if (!password)
        return res
          .status(400)
          .send({ status: false, msg: 'please enter password' });
  
      let findAuthor = await authormodel.findOne({
        email: userName,
        password: password,
      });
     
  if (!findAuthor)
        return res.status(404).send({
          status: false,
          msg: 'Email or Password is not valid',
        });
  
      let token = jwt.sign(
        {
          authorId: findAuthor._id.toString(),
        },
        secreteKey 
      );
      res.setHeader('x-api-key', token);
      res.status(200).send({ status: true, token: token });
      
    } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
    }
  };



module.exports.createauthor = createauthor 
module.exports.getauthor = getauthor 
module.exports.deleteauthor = deleteauthor 
module.exports.loginauthor = loginauthor


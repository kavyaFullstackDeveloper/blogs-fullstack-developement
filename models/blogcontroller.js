const { get } = require('mongoose');
const blogmodel = require('../models/blogsmodel');
const { query } = require('express');
const { notify } = require('..');

const isValidString = function (value) {
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };


const createblog = async function(req, res) {
    

    try{
        let data = req.body 

       let  {title,body,authorId,tags,category,subcategory} = data;

        if(title === "undefined" || title==null || typeof(title)!='string') return res.status(404).send("Title is required")
       
        if(body === "undefined" || body == null || typeof(body)!='string') return res.status(400).send("Body is required")

        if (authorId == null || !authorId ) return res.status(404).send("can not find a resource")

        if(tags == "undefined" || tags == null ) return res.status(404).send("Tag is required")

        if (category == "undefined" || category == null || typeof(category) != 'string') return res.status(404).send(" category is undefined")

        if(subcategory == "undefined" || subcategory == null || typeof(subcategory) != 'string') return res.status(404).send("can not find subcategory")
     
        const create = await blogmodel.create(data)
        return res.status(201).send({ status: true, message: "Blog Created Successfully", data: create })
    
    }
     

    catch(err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



const getblog = async function(req, res){
    let allblogs = await blogmodel.find()
    console.log(allblogs)

    if(allblogs.length > 0) res.send({msg: allblogs, condition: true})
    else res.send({msg: "No books found", condition: false})
    res.send({msg: allblogs})

    try{
        let filter = {isDeleted: false, publishedAt: null,isDeleted: null} 
        let qurey = req.query 
        let {authorId,tags,category,subcategory} = query 
        
        if (!isValidString(category)) {
            return res.status(400).send({
              status: false,
              message: "Category cannot be empty while fetching.",
            });
          }
          if (!isValidString(authorId)) {
            return res.status(400).send({
              status: false,
              message: "Author Id cannot be empty while fetching.",
            });
          }
          if (!isValidString(tags)) {
            return res.status(400).send({
              status: false,
              message: "Tags cannot be empty while fetching.",
            });
          }
          if (!isValidString(subcategory)) {
            return res.status(400).send({
              status: false,
              message: "Subcategory cannot be empty while fetching.",
            });
          }
 

       let blog = await blogmodel.find(filter)
        return res.status(201).send({status: true, message: "Blog list", data: blog}) 
       
    }

    catch (error) {
        res.status(500).send({ status: false, Error: error.message });
      }

}


const updateDetails = async function (req, res) {
  try {
  let authorIdFromToken = req.authorId;
  let blogId = req.params.blogId;
  let requestBody = req.body;
  const { title, body, tags, subcategory } = requestBody;
  
  
  if (!isValidString(blogId)) {
  return res
  .status(400)
  .send({ status: false, message: `BlogId is invalid.` });
  }
  
  if (!isValidString(title)) {
  return res
  .status(400)
  .send({ status: false, message: "Title is required for updatation." });
  }
  
  if (!isValidString(body)) {
  return res
  .status(400)
  .send({ status: false, message: "Body is required for updatation." });
  }
  
  if (tags) {
  if (tags.length === 0) {
  return res
  .status(400)
  .send({ status: false, message: "tags is required for updatation." });
  }
  }
  
  if (subcategory) {
  if (subcategory.length === 0) {
  return res.status(400).send({
  status: false,
  message: "subcategory is required for updatation.",
  });
  }
  }
  
  let Blog = await blogmodel.findOne({ _id: blogId });
  if (!Blog) {
  return res.status(400).send({ status: false, msg: "No such blog found" });
  }
  if (Blog.authorId.toString() !== authorIdFromToken) {
  res.status(401).send({
  status: false,
  message: `Unauthorized access! author's info doesn't match`,
  });
  return;
  }
  if (
  req.body.title ||
  req.body.body ||
  req.body.tags ||
  req.body.subcategory
  ) {
  const title = req.body.title;
  const body = req.body.body;
  const tags = req.body.tags;
  const subcategory = req.body.subcategory;
  const isPublished = req.body.isPublished;
  
  const updatedBlog = await blogmodel.findOneAndUpdate(
  { _id: req.params.blogId },
  {
  title: title,
  body: body,
  $addToSet: { tags: tags, subcategory: subcategory },
  isPublished: isPublished,
  },
  { new: true }
  );
  if (updatedBlog.isPublished == true) {
  updatedBlog.publishedAt = new Date();
  }
  if (updatedBlog.isPublished == false) {
  updatedBlog.publishedAt = null;
  }
  return res.status(200).send({
  status: true,
  message: "Successfully updated blog details",
  data: updatedBlog,
  });
  } else {
  return res
  .status(400)
  .send({ status: false, msg: "Please provide blog details to update" });
  }
  } catch (err) {
  res.status(500).send({
  status: false,
  Error: err.message,
  });
  }
  };


//DELETE /blogs/:blogId - Mark is Deleted:true if the blogId exists and it is not deleted.

const deleteBlogById = async function(req, res){

  try{
    let authorIdfromToken = req.authorId

    let id = req.params.blogId 

    let blog = await blogmodel.findOne({_id: id})


    if (!blog) return res.status(404).send({status: false, message: "No such a blog found."})

    if(blog.authorId.toString()  !== authorIdfromToken) return res.status(400).send({status: false, message: "Unauthoirised access, you are not a owner."})
  
    let delblog = await blogmodel.findOne({_id: id})

    if(delblog.isDeleted == false) {

      let updateAndDelete = await blogmodel.findOneAndUpdate({_id: id}, {isDeleted: true, deletedAt: Date() }, {new: true})

      return res.status(200).send({status: true, message: "Successfully deleted."})

    } 
    else{
        return res.status(404).send({status: false, message: "Blog has already been deleted"})

    }
   
  }
  

  catch(err){
    res.status(500).send({
      status: false,
      Error: err.message,
      });
  }
}

module.exports.createblog = createblog 
module.exports.getblog = getblog 
module.exports.updateDetails = updateDetails
module.exports.deleteBlogById = deleteBlogById 

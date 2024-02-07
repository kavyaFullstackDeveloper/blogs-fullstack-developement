const express = require('express');

const {default: mangoose, mongo, default: mongoose} = require('mongoose');

const bodyparser = require('body-parser');

const route = require('./routes/route');

const app  = express();

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://kavya:xLvSB2EPL3Th9y_@cluster0.ri0ljz1.mongodb.net/", {
    useNewUrlParser: true
})

.then( () => console.log("MongoDb is connected"))

.catch ( (err) => console.log(err) )


app.use('/', route);

app.listen(process.env.PORT || 3004, function(){
    console.log('express app running at ' + (process.env.PORT || 3004))
})

module.exports = app 

//mongodb+srv://kavya:xLvSB2EPL3Th9y_@cluster0.ri0ljz1.mongodb.net/


//mongodb+srv://jaganreddy-functionup:ORj2ygJHT7jbS3y8@cluster0.nduth.mongodb.net/url-shortner?retryWrites=true&w=majority

//https://www.youtube.com/watch?v=8aGhZQkoFbQ
const express = require('express');
const path=require('path');
const cors=require('cors');

const app=express();
const PORT=process.env.PORT || 3000;

const connectDB=require('./config/db');
app.use(express.static('public'));
app.use(express.json());

connectDB();
// cors
const corsOptions={
    origin:"*"
};
/*app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    next();
});*/
app.use(cors(corsOptions));
// template engine
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
//routes
app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show'))

app.use('/files/download',require('./routes/download'));

app.listen(PORT,()=>{
    console.log('Listening on port '+ PORT);
});
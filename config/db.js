const mongoose=require('mongoose');
require('dotenv').config();
function connectDB()
{
    // database connecetion 
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser: true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:true});

    const connection =mongoose.connection;



    connection.once('open',()=>{
        console.log('Database Connected');
    }).catch(err =>{
        console.log('connection failed');
    })

}

module.exports=connectDB;
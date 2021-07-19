
const File=require('./models/file');
const connectDB=require('./config/db');
const fs=require('fs');

connectDB();

async function fetchData(){

    const pastDate=new Date(Date.now() - 24*60*60 *1000);

    const files = await File.find({createdAt:{$lt: pastDate}});

    if(files.length)
    {
        for(const file of files)
        {
               try{
                fs.unlinkSync(file.path); // delete file from upload 
                await file.remove(); // remove from database

                console.log(`sucessfully deleted ${file.filename}`);
               } catch(err)
               {
                   console.log(`error while deleting file ${file.filename}`);
               }
        }
        console.log('job done');
    }
}

fetchData().then(process.exit);
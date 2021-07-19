const router=require('express').Router();
const File=require('../models/file');
//multer config
const multer=require('multer');
const {v4:uuid4} =require('uuid');

const path=require('path');
let storage =multer.diskStorage({
    destination:(req,file,cb)=> cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;

        cb(null,uniqueName);
    }
});

let upload=multer({
    storage,
    limit:{fileSize:1000000*100},

}).single('myfile');

router.post('/',(req,res)=>{
  

    // store file
        upload(req,res,async(err)=>{
              // validate request 

    if(!req.file){
        return res.json({error:'All files are required'});
}

                if(err)
                {
                    return res.status(500).send({error:err.message});
                }
                //store in database 
                const file = new File({

                    filename:req.file.filename,
                        uuid: uuid4(),
                        path:req.file.path,
                        size:req.file.size
                });

                const response=await file.save();

                return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`})
        });

    

    //response (link is send)
});



router.post('/send',async(req,res)=>{

    const {uuid,emailTo,emailFrom}=req.body;
    // validate req

    if(!uuid ||!emailTo||!emailFrom)
    {
        return res.status(422).send({error:'All fileds are required'});
    }
    //get data from database
    const file =await File.findOne({uuid:uuid});
    if(file.sender){
        return res.status(422).send({error:'Email already sent'});
    }
    file.sender=emailFrom;
    file.reciver=emailTo;

    const response =await file.save();

    // send email
    const sendMail=require('../services/emailService');
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:'File sharing',
        text:`${emailFrom} shared with you`,
        html:require('../services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000)+'KB',
            expires:'24 hours'

        })
    });
    return res.send({success:true});
})





module.exports=router;
const nodemailer=require("nodemailer");
const sendEmail=(To,url,text)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD // naturally, replace both with your real credentials or an application-specific password
        }
        });
    
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: To,
        subject: 'Developer Salman Email Verification',
        html: `${text}<br> <a href=${url}>Click Here</a>`
        };
    
        transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
            return error;
        }
        if(info){
            console.log("email sent")
            return info;
        }
    })
}

module.exports=sendEmail;
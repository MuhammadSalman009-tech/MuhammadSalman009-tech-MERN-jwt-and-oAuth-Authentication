const User=require("../Models/userModel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const sendEmail=require("./sendMail");


const {CLIENT_URL}=process.env;
const userController={
    register:async(req,res)=>{
        try {
            const {firstName, lastName, email, password}=req.body;
            //checking if the user inputs are empty
            if(!firstName||!lastName||!email||!password)
                return res.status(400).json({msg:"Please fill in all fields"});
            //checking if the user entered correct email    
            if(!validateEmail(email))
                return res.status(400).json({msg:"Invalid Email Address"});
            //checking if the user already exists in our db
            const user=await User.findOne({email});
            if(user) return res.status(400).json({msg:"Email already exists"}); 
            //checking password length      
            if(password.length<6)
                return res.status(400).json({msg:"password must be at least 6 characters"});
            const passwordHash=await bcrypt.hash(password,12);
            const newUser={
                firstName,lastName,email,password:passwordHash
            }
            const activation_token=createActivationToken(newUser);
            const url=`${CLIENT_URL}/user/activate/${activation_token}`;
            //Sending activation email to user
            sendEmail(newUser.email,url,"Click the link below to activate your account");
            res.json({msg:"Please check your inbox to activate your account"});

        } catch (error) {
            res.status(500).json({msg:error.message});
        }
    },
    emailActivation:async(req,res)=>{
        try {
            const {activation_token}=req.body;
            const user=jwt.verify(activation_token,process.env.ACTIVATION_TOKEN_SECRET);
            const {firstName,lastName,email,password}=user;
            const savedUser=await User.create({firstName,lastName,email,password});
            console.log(savedUser);

            res.json({msg:"Account has been activated"});
        } catch (error) {
            res.status(500).json({msg:error.message});
        }
    },
    login:async(req,res)=>{
        try {
            const {email,password}=req.body;
            const user=await User.findOne({email});
            if(!user) return res.status(400).json({msg:"This email does not exists"});
            const isMatching=await bcrypt.compare(password,user.password);
            if(!isMatching) return res.status(400).json({msg:"Password is incorrect"});
            const refresh_token=createRefreshToken({id:user._id});
            res.cookie('refreshToken',refresh_token,{
                httpOnly:true,
                path:"/user/refresh_token",
                maxAge:1000*60*60*24*7 //7 days
            })

            res.json({msg:"login success"});
        } catch (error) {
            res.status(500).json({msg:error.message});
        }
    },
    getAccessToken:async(req,res)=>{
        try {
            const rf_token=req.cookies.refreshToken;
            if(!rf_token) return res.status(400).json({msg:"Please login now!"});
            jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(error,user)=>{
                if(error) return res.status(401).json({msg:"Unauthorized Access, please login now!"});
                const access_token=createAccessToken({id:user.id});
                res.json({access_token});
            })
        } catch (error) {
            res.status(500).json({msg:error.message});
        }
    },
    forgotPassword:async(req,res)=>{
        try {
            const {email}=req.body;
            const user=await User.findOne({email});
            if(!user) return res.status(400).json({msg:"This email does not exist"});
            const access_token=createAccessToken({id:user._id});
            const url=`${CLIENT_URL}/user/reset/${access_token}`;
            sendEmail(email,url,"Click the link below to reset password");
            res.json({msg:"Re-Send password, please check your email"});
        } catch (error) {
            res.status(500).json({msg:error.message});
        }
    },
//     resetPassword:async(req,res)=>{
//         try {
//             const {password}=req.body;
//             const passwordHash=await bcrypt.hash(password,12);
//             const updatedUser=await User.findOneAndUpdate({_id:req.user.id},{
//                 password:passwordHash
//             })
//             if(updatedUser){
//                 return res.json({msg:"Password changed successfully"});
//             }
//         } catch (error) {
//             res.status(500).json({msg:error.message});
//         }
//     }
}
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

function createActivationToken(payload){
    return jwt.sign(payload,process.env.ACTIVATION_TOKEN_SECRET,{expiresIn:'5m'});
}
function createAccessToken(payload){
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'});
}
function createRefreshToken(payload){
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'});
}

module.exports=userController

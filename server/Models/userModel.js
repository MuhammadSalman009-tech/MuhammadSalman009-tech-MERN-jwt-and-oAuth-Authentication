const mongoose=require("mongoose");
const {isEmail}= require("validator");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,'First Name is required'],
        minlength:[4,'First Name must be greater than 4 characters']
    },
    lastName:{
        type:String,
        required:[true,'Last Name is required'],
        minlength:[4,'Last Name must be greater than 4 characters']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid Email Address']
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:[6,'Password must be greater than 6 characters']
    },
    role:{
        type:Number,
        default:0
    },
    avatar:{
        type:String,
        default:"http://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG-Free-Download.png"
    }
},{
    timestamps:true
});



const User=mongoose.model('user',userSchema);
module.exports = User;
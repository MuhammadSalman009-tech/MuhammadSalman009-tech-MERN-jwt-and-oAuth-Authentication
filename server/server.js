require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const fileUpload=require("express-fileupload");


const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
    useTempFiles:true
}))

const PORT = process.env.PORT|| 5000;


//Connection to MongoDB  
const CONNECTION_URL=process.env.MONGODB_URL;
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//Listening to server Server
.then(()=>app.listen(PORT,()=>console.log("Serving at http://localhost:"+PORT)))
.catch(error=>console.log("Database Connection Failed "+error));


//Routes
app.use("/user",require("./Routes/userRouter"));
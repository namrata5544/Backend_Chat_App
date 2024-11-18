import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
 
const cookieOptions={
  // here maxAge tells me about the maxAge of the cookies options
   maxAge:15*24*60*60*1000,
  
   sameSite:"none",
   httpOnly:true,
   secure:true,  
}
const connectDB= (uri)=>{
    mongoose
    .connect(uri,{dbName:"chat-app"})
    .then((data)=>{
    console.log(`connected to Db ${data.connection.host}`)
    })
    .catch((err)=>{
      throw err; 
    });
}

const sendToken= (res,user,code,message) =>{
    const token=jwt.sign({_id:user._id},
      process.env.JWT_SECRET,
    )
    
    return res.status(code).cookie("chat-token",token,cookieOptions).json({
      success:true,
      message,
    })
}

// this is give me the notifications when , when any event is going to occurs like event is store in the event.js file in the constant
// kis kis ko event bhejna hai , when any thing is happen like creating the group then it going to give the notification to all memeber of that group 
// users ko sare notification bhej dega
// data 

// by using the emitEvent  socket ke event ko emit krenge  
const emitEvent = (req,event,users,data)=>{
     console.log("emitting event",event);
}

const deleteFileFromCloudinary= async(public_ids)=>{
   // delete the files from CLoudinary
}

export {connectDB,sendToken,cookieOptions,emitEvent,deleteFileFromCloudinary};
import express from "express"
import { connectDB } from "./utlis/features.js";
import dotenv from 'dotenv'
import { errorMiddleWare } from "./middlewares/error.js";
import cookieParser from "cookie-parser"
import { createGroupChats,createSingleChats,createMessagesInAChat } from "./seeders/chat.js";
import { Server } from 'socket.io'
import { createServer } from "http"
import {v4 as uuid} from "uuid"
import { getSockets } from "./lib/helper.js";
import cors from "cors";

import userRoute from "./routes/user.js"
import chatRoute from "./routes/chat.js"
import adminRoute from "./routes/admin.js"
import { Socket } from "socket.io";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { Message } from "./models/message.js";



dotenv.config({
    path:"./.env",
})

const mongoURI=process.env.MONGO_URI

const PORT=process.env.PORT||3000;
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "adsasdsdfsdfsdfd";
const envMode= process.env.NODE_ENV.trim() || "PRODUCTION";
const userSocketIDs =new Map(); 
// here userSocketIDs have all the current active user which is connected
// after disconnected , we have to remove from the userSocketIDs

connectDB(mongoURI);
// createUser(10);
// createSingleChats(10);
// createGroupChats(10);
// createMessagesInAChat("672c87a9500d4857196e4f1e",50)

const app= express();
const server = createServer(app);

const io= new Server(server , {});


app.use(express.json())

app.use(cookieParser());

app.use(cors({
  // here we can pass the origin of all things means kon kon se url allow krna hai
// in origin we can pass the array of url
  origin:["http://localhost:5172","http://localhost:4173",
    process.env.CLIENT_URL,
  ],
  credentials:true,
}));


app.use('/api/v1/user',userRoute)
app.use('/api/v1/chat',chatRoute)
app.use("api/v1/admin",adminRoute);


app.get("/",(req,res)=>{
     res.send("hello")
})
io.use((socket,next)=>{
  // here we access the token using the cookie parser
})
// ye io.use middleware  wale ke badd hi socket se connect ho payenge


// here we setting the socket and we can access the individual socket
io.on("connection",(socket)=>{
  // here we accessing the token  for getting the user data which is passed in the option

  // socket.handshake.query.user
    
    // this user comes from the authentication
    // here we have the information about the user
    // here we are mapping the socket id on the userid
    userSocketIDs.set(user._id.toString(),socket.id);

    // here user._id is connected to the socket._id 
    // console.log(userSocketIDs);
    // currently active all the user

  console.log("a user connected ",socket.id);

// sare data comes from the front end 
// this sets up an event listener on the socket for the NEW_MESSAGE event.
// this fn is for sending the message to all the members 
// ye frontend se event emit hua 
  socket.on(NEW_MESSAGE,async({chatId,members,message})=>{
    /// inside the members ,we have all the userID 
    // we also have a map where we know which user is connect to which socket id 
    // 
  
    // frontend se message mil gaya and frontend se message bhej diya 
     const messageForRealtime = {
        content :message,
        // here using this uuid() we generate the random id
        _id:uuid(),
        sender:{
            _id:user._id,
            name:user.name
        },
        chat :chatId,
        createdAt : new Date().toISOString(),
     };
    const messageForDB = {
        content:message,
        sender:user._id,
        chat:chatId,
    }
  // here users is the member , from here we have the socket 
    const membersSocket =getSockets(members);
    // with the help of io.to -> we send the message 
    // like roomid pe message bjena hai
  // we have less user than
  // here frontend pe event emit bhi ho rha hai
  io.to(membersSocket).emit("NEW_MESSAGE",{
    chatId,
    message:messageForRealtime,
  });
  io.to(membersSocket).emit(NEW_MESSAGE_ALERT,{chatId})
    // io.to([...membersSocket]).emit(NEW_MESSAGE,messageForRealtime) for large number of user
    //  console.log("New Message",messageForRealtime)
    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
      
    }

  })
   



   socket.on("disconnect",()=>{
     console.log("user disconnected");
     userSocketIDs.delete(user._id.toString());
   }) 
});

app.use(errorMiddleWare);
// here insted of app we use the server
server.listen(PORT,()=>{
    console.log(`server is listening on ${PORT} in ${process.env.NODE_ENV} Mode `);
})

export{
    adminSecretKey,
    envMode,
    userSocketIDs
}
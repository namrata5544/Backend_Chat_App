
//here we are using this function for verifying the members in the my chat

import { userSocketIDs } from "../app.js"

const getOtherMember=(members,userId)=>{
    return members.find((member)=>member._id.toString()!==userId.toString())
}

const getSockets =(users) =>{

    // here we are traversing the users and from each user we get their corresponding socketIds
    const sockets =users.map((user)=>userSocketIDs.get(user._id.toString()) )
    // here sockets is the array of the socketId
   return sockets;

}

export {getOtherMember,getSockets}
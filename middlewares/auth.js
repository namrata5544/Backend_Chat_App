import { TryCatch } from "./error.js";
import {ErrorHandler} from "../utlis/utility.js"
import jwt from "jsonwebtoken"
import { adminSecretKey } from "../app.js";

const isAuthenticated = TryCatch(async(req,res,next)=>{

    const token=req.cookies['chat-token'];
    // console.log("cookies", req.cookies);
    
   if(!token){
    return next(new ErrorHandler("please login to access this route ",401))
   }

   try {
    // Verify the token and extract the user ID
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData._id;
    // console.log("req.user",req.user);

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle token verification errors (e.g., token expired or invalid)
    return next(new ErrorHandler("Invalid or expired token, please log in again", 401));
  }

})


// this middleware is for the check that after that rouute only admin can see my stats

const adminOnly = (req, res, next) => {
  const token = req.cookies["chattu-admin-token"];

  if (!token)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  const secretKey = jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  next();
};

export {
  isAuthenticated,
   adminOnly,

};
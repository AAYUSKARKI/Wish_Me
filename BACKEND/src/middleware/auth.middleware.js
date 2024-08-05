import { asynchandler } from "../utils/asynchandler.js"
import {Apierror} from "../utils/apierror.js"
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js"





export const verifyJWT = asynchandler(async(req,res,next)=>{
 try {
   // console.log(req.cookies)
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
   // console.log(token,'from frontend')
   // console.log(process.env.ACCESS_TOKEN_SECRET)
    if(!token){
       throw new Apierror(401,"unathorized token")
    }
   
    const decodedtoken= jwt.verify(token, "OTUCdjhudisEL&yesejhfuesfh_gsjfsejhfrusfnASSS8ifd")
   
   const user = await User.findById(decodedtoken?._id).select("-password -refreshtoken")
   
   if (!user){
       throw new Apierror(401,"invalid Acess token")
   }
   req.user = user;
   next()
 } catch (error) {
    throw new Apierror(401,error?.message|| InvalidAccessToken)
 }

})
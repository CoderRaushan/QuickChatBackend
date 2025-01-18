import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwtTokenFunction=(userId,username,email,profilePicture,res)=>
{
   const jwtToken=jwt.sign({userId,username,email,profilePicture},process.env.JwtTokenKEY,{expiresIn:"2d"});
   res.cookie('QuickChatjwtToken', jwtToken, 
   {
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true,              
      secure: true,                
      sameSite: 'None', 
      path: '/',             
    });
};
export default jwtTokenFunction;
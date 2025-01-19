import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwtTokenFunction=(userId,username,email,profilePicture,res)=>
{
   const jwtToken=jwt.sign({userId,username,email},process.env.JwtTokenKEY,{expiresIn:"2d"});
   
   /*
  res.cookie('quickchatjwttoken', jwtToken, {
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  httpOnly: true,              // Prevent JavaScript access
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // CSRF protection
  path: '/',                   // Accessible throughout the domain
  domain: 'example.com',       // Specify domain (if required)
  priority: 'High',            // High priority
});

    
    */
   res.cookie('quickchatjwttoken', jwtToken, 
   {
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true,              
      secure: false,                // Allow cookies over HTTP
      sameSite: "none",            // Prevent CSRF on same-site request         
    });
};
export default jwtTokenFunction;
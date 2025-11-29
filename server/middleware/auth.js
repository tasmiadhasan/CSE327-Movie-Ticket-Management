import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next)=>{
  try {
    // req.auth() from clerk returns an object; grab the userId property
    const auth = req.auth && typeof req.auth === 'function' ? req.auth() : req.auth;
    const userId = auth?.userId;

    // Debug logs to surface auth issues during development
    console.log('protectAdmin called - auth:', !!auth, 'userId:', userId);

    if(!userId){
      console.warn('protectAdmin: missing userId on request.auth');
      return res.status(401).json({ success: false, message: "not authorized" });
    }

    const user = await clerkClient.users.getUser(userId)

    if(user?.privateMetadata?.role !== 'admin'){
      console.warn('protectAdmin: user is not admin - userId:', userId, 'role:', user?.privateMetadata?.role);
      return res.status(403).json({success: false, message: "not authorized"})
    }

    next();
  } catch (error) {
    console.error('protectAdmin error:', error?.message || error);
    return res.status(401).json({ success: false, message: "not authorized" });
  }
}
import jwt from 'jsonwebtoken';


const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Verify JWT token in request headers
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const verifyToken = (req,res,next)=>{

    /*
    * Check if Authorization header is present
    */
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message:"Access denied"});
    }

    /*
    * Extract token from Authorization header
    */
    const token = authHeader.split(" ")[1];

    try{
        /*
        * Verify token using JWT secret
        */
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;

        next();

    }catch(err){
        /*
        * Return 403 if token is invalid
        */
        return res.status(403).json({message:"Invalid token"});

    }

};


module.exports = verifyToken;


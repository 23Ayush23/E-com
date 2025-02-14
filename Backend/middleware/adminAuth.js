import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


const adminAuth = (req, res, next) => {
    try {
      const token = req.headers.token;
  
      if (!token) {
        return res.status(401).json({ success: false, message: "No token provided. Please log in." });
      }
  
      // Verify token (this will throw an error if the token is expired or invalid)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Check if the decoded token matches the admin credentials
      if (decoded.email !== process.env.ADMIN_EMAIL || decoded.password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: "Unauthorized admin!" });
      }
      
      // Token is valid and admin is authenticated
      next();
    } catch (error) {
      // If the token has expired, jwt.verify will throw a TokenExpiredError
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
      }
      console.log(error);
      return res.status(401).json({ success: false, message: "Invalid token. Please log in." });
    }
  };

export default adminAuth
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};



const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // access in protected routes
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }
    next();
  };
  



module.exports = {verifyToken, isAdmin , generateToken};



  
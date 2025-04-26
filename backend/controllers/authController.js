const { generateToken } = require('../middlewares/generateToken');
const { Employee, Client, Advocate } = require('../model');
const bcrypt = require('bcrypt');


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // First check Employee table
    const employee = await Employee.findOne({ where: { email } });
    if (employee) {
      const match = await bcrypt.compare(password, employee.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = generateToken({ id: employee.id, role: employee.role });

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: employee.id,
          name: employee.employee_name,
          email: employee.email,
          role: employee.role // 'admin' or 'employee'
        },
      });
    }

    // Then check Client table
    const client = await Client.findOne({ where: { email } });
    if (client) {
      console.log(client)
      const match = await bcrypt.compare(password, client.password);
      console.log(match)
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = generateToken({ id: client.id, role: 'client' });

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: client.id,
          name: client.name,
          email: client.email,
          role: 'client' // 🔥 hardcoded here
        },
      });
    }

    // Lastly check Advocate table
    const advocate = await Advocate.findOne({ where: { email } });
    if (advocate) {
      const match = await bcrypt.compare(password, advocate.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = generateToken({ id: advocate.id, role: 'advocate' });

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: advocate.id,
          name: advocate.name,
          email: advocate.email,
          role: 'advocate' // 🔥 hardcoded here
        },
      });
    }

    // If no user found
    return res.status(404).json({ message: 'User not found' });

  } catch (err) {
    console.error('💥 Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};




const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};


//
// get Cureent User

const jwt = require('jsonwebtoken');

const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not logged in' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = null;

    if (decoded.role === 'admin' || decoded.role === 'employee') {
      user = await Employee.findByPk(decoded.id);
    } else if (decoded.role === 'client') {
      user = await Client.findByPk(decoded.id);
    } else if (decoded.role === 'advocate') {
      user = await Advocate.findByPk(decoded.id);
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Always send same structure
    return res.json({
      id: user.id,
      name: user.employee_name || user.name,
      email: user.email,
      role: decoded.role,
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
};




module.exports = { login, logout , getCurrentUser};

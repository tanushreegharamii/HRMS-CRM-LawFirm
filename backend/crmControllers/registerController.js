const { Client } = require('../model');
const bcrypt = require('bcrypt');
const { Advocate, OfflineCase, OfflineClient } = require('../model');
exports.registerClient = async (req, res) => {
  try {
    const { name, email, phone, address, city, country, password } = req.body;

    const existingClient = await Client.findOne({ where: { email } });
    if (existingClient) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newClient = await Client.create({
      name,
      email,
      phone,
      address,
      city,
      country,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Client registered successfully', client: newClient });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};


// offline register by admin or advocate
exports.registerOfflineClient = async (req, res) => {
  try {
    const { fullName, phone, address, city, country, createdByAdvocateId, createdByAdmin } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    const offline = await OfflineClient.create({
      fullName,
      phone,
      address,
      city,
      country,
      createdByAdvocateId: createdByAdvocateId || null,
      createdByAdmin: createdByAdmin === true
    });

    res.status(201).json({
      message: 'Offline client registered successfully',
      data: offline
    });
  }
  catch (error) { console.error('❌ Offline client registration error:', error); res.status(500).json({ message: 'Server error', error: error.message }); }
};
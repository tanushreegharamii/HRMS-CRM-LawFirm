// advocatecontroller

const { Op } = require('sequelize');

const { Advocate, OfflineCase, OfflineClient, Client, ChatRoom } = require('../model');
const bcrypt = require('bcrypt');
const validator = require('validator');

module.exports = {
  registerAdvocate: async (req, res) => {
    try {
      const { name, email, phone, address, city, country, experience, specialization, licenseNumber, password } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
      }

      const existing = await Advocate.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let profileImageUrl = null;
      if (req.file) {
        profileImageUrl = req.file.path; // multer-storage-cloudinary returns secure_url here
      }


      const newAdvocate = await Advocate.create({
        name,
        email,
        phone,
        address,
        city,
        country,
        experience,
        specialization,
        licenseNumber,
        password: hashedPassword,
        profileImage: profileImageUrl
      });

      res.status(201).json({
        message: 'Advocate registered successfully',
        data: newAdvocate
      });

    } catch (error) {
      console.error('❌ Advocate registration error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  updateAdvocateProfile: async (req, res) => {
    try {
      const advocateId = req.params.id;
      const updates = req.body;

      const advocate = await Advocate.findByPk(advocateId);
      if (!advocate) {
        return res.status(404).json({ message: 'Advocate not found' });
      }

      // ✅ Apply updates
      const allowedFields = ['name', 'phone', 'address', 'city', 'country', 'experience', 'specialization'];
      allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
          advocate[field] = updates[field].trim?.() || updates[field];
        }
      });

      // ✅ Update profileImage if provided
      if (req.file) {
        advocate.profileImage = req.file.path;
      }

      await advocate.save();

      res.status(200).json({ message: 'Profile updated successfully', data: advocate });

    } catch (error) {
      console.error('❌ Profile update error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  // entry case for offline clients
  // ✅ Updated controller: createOfflineCase
  createOfflineCase: async (req, res) => {
    try {
      const advocateId = req.user?.id;
      const {
        offlineClientId,
        clientName,
        clientType,
        country,
        phNumber,
        address,
        caseName,
        caseType,
        caseStatus,
        caseDetails,
        associatedWithAdvocate,
        advocateName,
        advocatePhNumber,
        isPaymentDone,
        paymentMode,
        paymentDateTime,
        fees,
        generateInvoice
      } = req.body;

      if (!caseName || !clientName) {
        return res.status(400).json({ message: 'Required fields missing' });
      }

      let aadhaarUrl = null;
      let documents = [];

      if (req.files?.aadhaar?.[0]) {
        aadhaarUrl = req.files.aadhaar[0].path;
      }

      if (req.files?.documents?.length > 0) {
        documents = req.files.documents.map(file => ({
          url: file.path,
          uploadedAt: new Date()
        }));
      }

      // 🧠 Sanitize date and optional payment fields
      const parsedPaymentDate = isPaymentDone === "yes" && paymentDateTime ? new Date(paymentDateTime) : null;
      const sanitizedPaymentMode = isPaymentDone === "yes" ? paymentMode : null;
      const sanitizedFees = isPaymentDone === "yes" ? fees : null;

      const newCase = await OfflineCase.create({
        offlineClientId: offlineClientId || null,
        advocateId: advocateId || null,
        clientName,
        clientType,
        country,
        phNumber,
        address,
        caseName,
        caseType,
        caseStatus: caseStatus || 'running',
        caseDetails,
        aadhaarUrl,
        documents,
        associatedWithAdvocate,
        advocateName,
        advocatePhNumber,
        isPaymentDone,
        paymentMode: sanitizedPaymentMode,
        paymentDateTime: parsedPaymentDate,
        fees: sanitizedFees,
        generateInvoice: generateInvoice === 'true' || generateInvoice === true,
        uploadedAt: new Date()
      });

      res.status(201).json({
        message: '✅ Offline case created successfully',
        data: newCase
      });
    } catch (error) {
      console.error('❌ Create offline case error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  // get all advocates
  getAllAdvocates: async (req, res) => {
    try {
      const allAdvocates = await Advocate.findAll({ order: [['createdAt', 'DESC']] });
      res.status(200).json(allAdvocates);
    }
    catch (error) {
      console.error('❌ Error fetching advocates:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  getAllClients: async (req, res) => {
    try {
      const clients = await Client.findAll({ order: [['createdAt', 'DESC']] });
      res.status(200).json(clients);
    } catch (error) {
      console.error('❌ Error fetching clients:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // advocate gets own client
  getClientsForAdvocate: async (req, res) => {
    try {
      const advocateId = req.user?.id;
      if (!advocateId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const clients = await OfflineCase.findAll({
        where: { advocateId },
        attributes: [
          "id",
          "clientName",
          "phNumber",
          "address",
          "caseName",
          "caseType",
          "caseStatus",
          "createdAt"
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(clients)
    }
    catch (error) {
      console.error("❌ Error fetching clients for advocate:", error);
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },


  getOwnProfile: async (req, res) => {
    try {
      const advocateId = req.user.id;

      const advocate = await Advocate.findByPk(advocateId);

      if (!advocate) {
        return res.status(404).json({ message: "Advocate not found" });
      }

      res.status(200).json(advocate);
    } catch (err) {
      console.error("❌ getOwnProfile error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },


  updateOwnProfile: async (req, res) => {
    try {
      const advocateId = req.user.id;

      const advocate = await Advocate.findByPk(advocateId);
      if (!advocate) return res.status(404).json({ message: "Advocate not found" });

      const {
        name,
        phone,
        address,
        city,
        country,
        experience,
        specialization,
        licenseNumber,
      } = req.body;

      // ✅ Update fields
      advocate.name = name;
      advocate.phone = phone;
      advocate.address = address;
      advocate.city = city;
      advocate.country = country;
      advocate.experience = experience;
      advocate.specialization = specialization;
      advocate.licenseNumber = licenseNumber;

      // ✅ Profile Image via Cloudinary (if uploaded)
      if (req.file || req.files?.profileImage?.[0]) {
        const file = req.file || req.files.profileImage[0];
        advocate.profileImage = file.path; // path is Cloudinary secure_url
      }

      await advocate.save();

      res.status(200).json(advocate);
    } catch (error) {
      console.error("❌ updateOwnProfile error:", error);
      res.status(500).json({ message: "Update failed", error: error.message });
    }
  },

  //advocate is chatting with another advocate
 

};



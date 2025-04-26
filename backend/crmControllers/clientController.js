const { Client, Case, Advocate } = require('../model');
const cloudinary = require('../middlewares/crmCloudinary')

const upload = require('../middlewares/crmCloudinary')
module.exports = {
  // ✅ Create Case
  createCase: async (req, res) => {
    try {
      const {
        clientId,
        advocateId,
        caseName,
        caseType,
        caseStatus,
        caseDetails
      } = req.body;

      if (!clientId || !caseName) {
        return res.status(400).json({ message: 'clientId and caseName are required' });
      }

      let aadhaarUrl = null;
      let documents = [];

      if (req.files?.aadhaar?.[0]) {
        aadhaarUrl = req.files.aadhaar[0].path;
      }

      if (req.files?.documents) {
        documents = req.files.documents.map(file => ({
          url: file.path,
          uploadedAt: new Date()
        }));
      }

      const newCase = await Case.create({
        clientId,
        advocateId: advocateId || null,
        caseName,
        caseType,
        caseStatus: caseStatus || 'running',
        caseDetails,
        aadhaarUrl,
        documents,
        uploadedAt: new Date()
      });

      res.status(201).json({
        message: 'Case created successfully',
        data: newCase
      });

    } catch (error) {
      console.error('🔥 Case creation error:', error);
      res.status(500).json({ message: 'Server error while creating case', error: error.message });
    }
  },

  getOwnProfile: async (req, res) => {
    try {
      const clientId = req.user.id;
      const client = await Client.findByPk(clientId, {
        attributes: { exclude: ['password'] },
      });
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error });
    }
  },

  updateOwnProfile: async (req, res) => {
    try {
      const clientId = req.user.id;
      const client = await Client.findByPk(clientId);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
  
      const {
        name,
        phone,
        address,
        city,
        country,
      } = req.body;
  
      // ✅ Simple field updates
      client.name = name;
      client.phone = phone;
      client.address = address;
      client.city = city;
      client.country = country;
  
      // ✅ Profile image (already uploaded to Cloudinary via multer)
      if (req.files?.profileImage?.[0]) {
        client.profileImage = req.files.profileImage[0].path;
      }
  
      // ✅ Aadhaar (also from Cloudinary)
      if (req.files?.aadhaar?.[0]) {
        client.aadhaarUrl = req.files.aadhaar[0].path;
      }
  
      await client.save();
      res.json({ message: "Profile updated successfully", client });
  
    } catch (error) {
      console.error("❌ updateOwnProfile error:", error);
      res.status(500).json({ message: "Update failed", error: error.message });
    }
  }  
  ,



  // ✅ Get All Cases
  getAllCases: async (req, res) => {
    try {
      const cases = await Case.findAll({
        include: [Advocate, Client],
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json({ data: cases });
    } catch (error) {
      console.error('❌ Get all cases error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  getCasesByClientId: async (req, res) => {
    try {
      const clientId = req.params.id;
      console.log(clientId, "from clientID")
      const cases = await Case.findAll({
        where: { clientId },
        include: [Advocate],
        order: [['createdAt', 'DESC']]
      });
  
      res.status(200).json({ data: cases });
  
    } catch (error) {
      console.error('❌ Get client cases error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  

  // ✅ Update Case Info
  updateCase: async (req, res) => {
    try {
      const caseId = req.params.id;
      const updates = req.body;

      const caseRecord = await Case.findByPk(caseId);
      if (!caseRecord) {
        return res.status(404).json({ message: 'Case not found' });
      }

      const allowedFields = ['caseName', 'caseType', 'caseStatus', 'caseDetails', 'advocateId'];

      for (let key of allowedFields) {
        if (updates[key] !== undefined) {
          caseRecord[key] = updates[key];
        }
      }

      await caseRecord.save();

      res.status(200).json({
        message: 'Case updated successfully',
        data: caseRecord
      });

    } catch (error) {
      console.error('❌ Update case error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // ✅ Delete Case
  deleteCase: async (req, res) => {
    try {
      const caseId = req.params.id;
      const deleted = await Case.destroy({ where: { id: caseId } });

      if (!deleted) {
        return res.status(404).json({ message: 'Case not found' });
      }

      res.status(200).json({ message: 'Case deleted successfully' });

    } catch (error) {
      console.error('❌ Delete case error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // ✅ Update Case Files (add/replace documents or aadhaar)
  updateCaseFiles: async (req, res) => {
    try {
      const caseId = req.params.id;
      const caseRecord = await Case.findByPk(caseId);

      if (!caseRecord) {
        return res.status(404).json({ message: 'Case not found' });
      }

      const updatedFields = {};

      if (req.files?.aadhaar?.[0]) {
        updatedFields.aadhaarUrl = req.files.aadhaar[0].path;
      }

      if (req.files?.documents?.length > 0) {
        const newDocs = req.files.documents.map(file => ({
          url: file.path,
          uploadedAt: new Date()
        }));

        const existingDocs = caseRecord.documents || [];
        updatedFields.documents = [...existingDocs, ...newDocs];
      }

      await caseRecord.update(updatedFields);

      res.status(200).json({
        message: 'Case files updated successfully',
        data: caseRecord
      });

    } catch (error) {
      console.error('❌ Update case files error:', error);
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
};

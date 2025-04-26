const { Case } = require('../model');

// ✅ Create new case by logged-in client
const createClientCaseByClient = async (req, res) => {
  try {
    const clientId = req.user.id;

    const { caseName, caseType, caseStatus, caseDetails } = req.body;

    if (!caseName) {
      return res.status(400).json({ message: 'Case name is required' });
    }

    let aadhaarUrl = null;
    let documents = [];

    // Aadhaar Upload (from Cloudinary if configured via multer)
    if (req.files?.aadhaar?.[0]) {
      aadhaarUrl = req.files.aadhaar[0].path;
    }

    // Case Document Upload
    if (req.files?.documents?.length > 0) {
      documents = req.files.documents.map(file => ({
        url: file.path,
        uploadedAt: new Date()
      }));
    }

    const newCase = await Case.create({
      clientId,
      caseName,
      caseType,
      caseStatus,
      caseDetails,
      aadhaarUrl,
      documents
    });

    res.status(201).json({ message: 'Case created successfully', data: newCase });
  } catch (error) {
    console.error("❌ createClientCaseByClient error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get all cases for the logged-in client
const getAllClientCasesByClient = async (req, res) => {
  try {
    const clientId = req.user.id;

    const cases = await Case.findAll({
      where: { clientId },
      order: [['uploadedAt', 'DESC']]
    });

    res.status(200).json({ data: cases });
  } catch (error) {
    console.error("❌ getAllClientCasesByClient error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Update a case by its ID (only if belongs to this client)
const updateClientCaseByClient = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user.id;

    const existingCase = await Case.findOne({ where: { id, clientId } });

    if (!existingCase) {
      return res.status(404).json({ message: 'Case not found or unauthorized' });
    }

    const { caseName, caseType, caseStatus, caseDetails, existingDocuments, aadhaarUrl } = req.body;

    // ✅ Aadhaar update
    if (req.files?.aadhaar?.[0]) {
      existingCase.aadhaarUrl = req.files.aadhaar[0].path;
    } else if (aadhaarUrl) {
      existingCase.aadhaarUrl = aadhaarUrl;
    }

    // ✅ Documents update
    let docs = existingCase.documents || [];

    if (req.files?.documents?.length > 0) {
      const uploadedDocs = req.files.documents.map(file => file.path);
      docs = [...(Array.isArray(existingDocuments) ? existingDocuments : (existingDocuments ? [existingDocuments] : [])), ...uploadedDocs];
    } else if (existingDocuments) {
      docs = Array.isArray(existingDocuments) ? existingDocuments : [existingDocuments];
    }

    existingCase.documents = docs;

    // ✅ Text fields update
    existingCase.caseName = caseName || existingCase.caseName;
    existingCase.caseType = caseType || existingCase.caseType;
    existingCase.caseStatus = caseStatus || existingCase.caseStatus;
    existingCase.caseDetails = caseDetails || existingCase.caseDetails;

    await existingCase.save();

    res.status(200).json({ message: 'Case updated successfully', data: existingCase });
  } catch (error) {
    console.error("❌ updateClientCaseByClient error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Delete a specific case by ID
const deleteClientCaseByClient = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user.id;

    const existingCase = await Case.findOne({ where: { id, clientId } });

    if (!existingCase) {
      return res.status(404).json({ message: 'Case not found or unauthorized' });
    }

    await existingCase.destroy();
    res.status(200).json({ message: 'Case deleted successfully' });
  } catch (error) {
    console.error("❌ deleteClientCaseByClient error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createClientCaseByClient,
  getAllClientCasesByClient,
  updateClientCaseByClient,
  deleteClientCaseByClient
};

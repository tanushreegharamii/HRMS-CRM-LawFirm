// casecontroller

const { OfflineCase } = require('../model');

module.exports = {
  // ✅ Get all cases
  getAllCases: async (req, res) => {
    try {
      const advocateId = req.user.id; // ✅ set by verifyToken middleware

      if (!advocateId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const cases = await OfflineCase.findAll({
        where: { advocateId },
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json(cases);
    } catch (err) {
      console.error("❌ Error fetching own cases:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
  getCaseById: async (req, res) => {
    try {
      const id = req.params.id;
      const singleCase = await OfflineCase.findByPk(id);
      if (!singleCase) {
        return res.status(404).json({ message: 'Case not found' });
      }
      res.status(200).json(singleCase);
    } catch (err) {
      console.error("❌ Error fetching case:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  // ✅ Get only running cases
  getRunningCases: async (req, res) => {
    try {
      const runningCases = await OfflineCase.findAll({
        where: { caseStatus: 'running' },
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(runningCases);
    } catch (err) {
      console.error("❌ Error fetching running cases:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  // ✅ Get only disposed cases
  getDisposedCases: async (req, res) => {
    try {
      const advocateId = req.user.id;
  
      const disposedCases = await OfflineCase.findAll({
        where: {
          caseStatus: 'disposed',
          advocateId, // ✅ only show cases for the logged-in advocate
        },
        order: [['createdAt', 'DESC']]
      });
  
      res.status(200).json(disposedCases);
    } catch (err) {
      console.error("❌ Error fetching disposed cases:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  // update cases offline
  updateOfflineCase: async (req, res) => {
    try {
      const caseId = req.params.id;
      const {
        caseName,
        caseType,
        caseStatus,
        caseDetails,
        clientName,
        phNumber,
        address,
        country,
        associatedWithAdvocate,
        advocateName,
        advocatePhNumber,
        isPaymentDone,
        paymentDateTime,
        paymentMode,
        fees,
      } = req.body;
  
      const parsedPaymentDate =
        isPaymentDone === "yes" && paymentDateTime ? new Date(paymentDateTime) : null;
  
      const existingCase = await OfflineCase.findByPk(caseId);
      if (!existingCase) {
        return res.status(404).json({ message: "Case not found" });
      }
  
      let newDocuments = [];
      if (req.files?.documents?.length > 0) {
        newDocuments = req.files.documents.map((file) => ({
          url: file.path,
          uploadedAt: new Date(),
        }));
      }
  
      const allDocuments = [...(existingCase.documents || []), ...newDocuments];
  
      await existingCase.update({
        caseName: caseName || existingCase.caseName,
        caseType: caseType || existingCase.caseType,
        caseStatus: caseStatus || existingCase.caseStatus,
        caseDetails: caseDetails || existingCase.caseDetails,
        clientName: clientName || existingCase.clientName,
        phNumber: phNumber || existingCase.phNumber,
        address: address || existingCase.address,
        country: country || existingCase.country,
        associatedWithAdvocate: associatedWithAdvocate || existingCase.associatedWithAdvocate,
        advocateName: advocateName || existingCase.advocateName,
        advocatePhNumber: advocatePhNumber || existingCase.advocatePhNumber,
        isPaymentDone,
        paymentDateTime: parsedPaymentDate,
        paymentMode,
        fees,
        documents: allDocuments,
      });
  
      res.status(200).json({ message: "✅ Case updated successfully", data: existingCase });
  
    } catch (error) {
      console.error("❌ Error updating case:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
  
};

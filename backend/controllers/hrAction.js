const { Employee, Promotion, Transfer, Termination } = require("../model");

// ✅ Promote Employee
exports.promoteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { newDesignation, newLocation, promotionDate } = req.body;

    const employee = await Employee.findByPk(employeeId);

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Record promotion history
    await Promotion.create({
      employeeId: employee.id,
      previousDesignation: employee.designation,
      newDesignation,
      promotionDate,
    });

    // Update employee's designation and location
    await employee.update({
      designation: newDesignation,
      jobLocation: newLocation,
    });

    res.status(201).json({ message: "Promotion successful" });

  } catch (error) {
    console.error("Error promoting employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all promotions of a particular employee
exports.getPromotionsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const promotions = await Promotion.findAll({
      where: { employeeId },
      order: [["promotionDate", "DESC"]],
    });

    res.status(200).json(promotions);

  } catch (error) {
    console.error("Error fetching promotion history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all promoted employees (for listing)
exports.getPromotedEmployees = async (req, res) => {
  try {
    const promotions = await Promotion.findAll({
      include: [{
        model: Employee,
        attributes: ['id', 'employee_name', 'employee_id'],
      }],
      order: [["promotionDate", "DESC"]],
    });

    res.status(200).json(promotions);

  } catch (error) {
    console.error("Error fetching promoted employees:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Transfer Employee
exports.transferEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { toDepartment, toLocation, reason, transferDate } = req.body;

    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const transfer = await Transfer.create({
      employeeId,
      fromDepartment: employee.department,
      toDepartment,
      fromLocation: employee.jobLocation,
      toLocation,
      reason,
      transferDate,
    });

    await employee.update({
      department: toDepartment,
      jobLocation: toLocation,
    });

    res.status(201).json({ message: "Employee transferred", data: transfer });
  } catch (error) {
    console.error("🔥 transferEmployee error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTransfersByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const history = await Transfer.findAll({
      where: { employeeId },
      order: [["transferDate", "DESC"]],
    });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transfer history" });
  }
};

// ✅ Terminate Employee
exports.terminateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { reason, terminationDate, notes } = req.body;

    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const termination = await Termination.create({
      employeeId,
      reason,
      terminationDate,
      notes,
    });

    await employee.update({ status: "terminated" });

    res.status(201).json({ message: "Employee terminated", data: termination });
  } catch (error) {
    console.error("🔥 terminateEmployee error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTerminationDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const termination = await Termination.findOne({
      where: { employeeId },
    });

    if (!termination) {
      return res.status(404).json({ message: "No termination record found" });
    }

    res.status(200).json(termination);
  } catch (error) {
    res.status(500).json({ message: "Error fetching termination details" });
  }
};

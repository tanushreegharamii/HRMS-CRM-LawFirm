const { where } = require('sequelize');
const { Promotion } = require('../model');
const { Employee } = require('../model')

exports.promoteEmployee = async (req, res) => {
    try {
      const { employeeId, newDesignation, promotionDate, newDepartment } = req.body;
  
      console.log(' Incoming request body:', req.body);
      console.log(' employeeId value:', employeeId);
  
      const employee = await Employee.findOne({ where: { employee_id: employeeId } });
  
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
  
      // ✅ Save promotion record
      const promotion = await Promotion.create({
        employeeId: employee.id,
        previousDesignation: employee.designation,  //  now using correct field
        newDesignation,
        promotionDate
      });
  
      // ✅ Update employee table
      employee.designation = newDesignation;
  
      if (newDepartment) {
        employee.department = newDepartment;
      }
  
      await employee.save();
  
      res.status(201).json({ message: 'Promotion successful', promotion });
    } catch (error) {
      console.error('🔥 Promotion error:', error);
      res.status(500).json({ message: 'Error promoting employee', error: error.message || error.toString() });
    }
  };
  
















exports.getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.findAll({
            include: [{ model: Employee }]
        });
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching promotions', error });
    }
};

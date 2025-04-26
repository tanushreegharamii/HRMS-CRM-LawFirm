const { Employee, Attendance, LeaveRequest, Payroll, Transfer, Termination } = require('../model');
const bcrypt = require('bcrypt');

// Admin registers a new employee
const registerEmployee = async (req, res) => {
  try {
    const {
      employee_name, employee_id, address, role,
      email, phone, department, position,
      join_date, aadhaar_number, salary,
      employment_status, password
    } = req.body;

    // Handle file upload URLs from Cloudinary (added by multer)
    const aadhaarImageUrl = req.files?.aadhaar_image?.[0]?.path;
    const profilePhotoUrl = req.files?.profile_photo?.[0]?.path;

    // Validate file size (although multer already does it)
    if (!aadhaarImageUrl || !profilePhotoUrl) {
      return res.status(400).json({ message: 'Aadhaar image and profile photo are required and must be under 1MB' });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await Employee.create({
      employee_name,
      employee_id,
      address,
      role: role || 'employee',
      email,
      phone,
      department,
      position,
      join_date,
      aadhaar_number,
      profile_photo: profilePhotoUrl,
      aadhaar_image: aadhaarImageUrl,
      salary,
      employment_status: employment_status || 'active',
      password: hashedPassword
    });

    res.status(201).json({
      message: 'Employee registered successfully',
      employee: newEmployee
    });
  } catch (err) {
    console.error('Register employee error:', err);
    res.status(500).json({ message: err.message || 'Registration failed, Check Email and File size' });
  }
};

// Admin gets all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({ where: { role: 'employee' } });
    res.status(200).json({ employees });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: err.message || 'Could not fetch employee' });

  }
};



// Admin views full employee profile
const getEmployeeProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({
      where: { id },
      // Optional: explicitly include all the fields you care about
      attributes: [
        'id',
        'employee_name',
        'employee_id',
        'email',
        'phone',
        'department',
        'join_date',
        'role',
        'aadhaar_image',     //  Include Aadhaar image
        'profile_photo',     //  Include profile photo
        'address',
        'aadhaar_number',
        'createdAt',
        'updatedAt'
      ],
      include: [
        { model: Attendance, as: 'attendances' },
        { model: LeaveRequest, as: 'leaveRequests' },
        { model: Payroll, as: 'payroll' }
      ]
    });

    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    res.status(200).json({ employee });
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ message: 'Could not fetch profile' });
  }
};




//terminate employrr
const terminateEmployee = async (req, res) => {
  const { employeeId } = req.params; 
  const { reason, terminationDate, notes } = req.body; 
const employee = await Employee.findByPk(employeeId); // ✅ use findByPk safely

if (!employee) {
  return res.status(404).json({ error: 'Employee not found' });
}

//  Update employee's status
employee.status = 'terminated';
await employee.save();

//  Create termination record
const termination = await Termination.create({
  employeeId: employee.id,
  reason,
  terminationDate,
  notes,
});

return res.status(200).json({ message: 'Employee terminated', termination });
};



const getAllTerminatedEmployees = async (req, res) => {
  try {
    const terminations = await Termination.findAll({
      include: [
        {
          model: Employee,
          attributes: ['id', 'employee_id', 'employee_name'],
        },
      ],
      order: [["terminationDate", "DESC"]],
    });

    res.status(200).json(terminations); // ✅ send result
  } catch (error) {
    console.error("🔥 Error fetching terminated employees:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};












// prmote employee
const promoteEmployee = async (req, res) => {
  const { id } = req.params;
  const { position, salary } = req.body;

  const employee = await Employee.findByPk(id);
  if (!employee) return res.status(404).json({ error: 'Employee not found' });

  employee.position = position || employee.position;
  employee.salary = salary || employee.salary;
  await employee.save();

  res.status(200).json({ message: 'Employee promoted', employee });
};


//transfer
const transferEmployee = async (req, res) => {
  try {
    const { employeeId, toDepartment, toLocation, transferDate, reason } = req.body;

    const employee = await Employee.findOne({ where: { employee_id: employeeId } });

    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const transfer = await Transfer.create({
      employeeId: employee.id,
      fromDepartment: employee.department,
      toDepartment,
      fromLocation: employee.jobLocation,
      toLocation,
      transferDate,
      reason
    });

    // Update jobLocation and department in employee table
    employee.jobLocation = toLocation;
    if (toDepartment) employee.department = toDepartment;

    await employee.save();

    res.status(201).json({ message: 'Transfer successful', transfer });
  } catch (error) {
    console.error('🔥 Transfer error:', error);
    res.status(500).json({ message: 'Error transferring employee', error: error.message || error.toString() });
  }
};

exports.getAllTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.findAll({
      include: [{ model: Employee }]
    });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transfers', error });
  }
};





// update employee info
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      employee_name,
      employee_id,
      address,
      role,
      email,
      phone,
      department,
      position,
      join_date,
      aadhaar_number,
      salary,
      employment_status
    } = req.body;

    const employee = await Employee.findByPk(id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    //  Update fields from body
    employee.employee_name = employee_name || employee.employee_name;
    employee.employee_id = employee_id || employee.employee_id;
    employee.address = address || employee.address;
    employee.role = role || employee.role;
    employee.email = email || employee.email;
    employee.phone = phone || employee.phone;
    employee.department = department || employee.department;
    employee.position = position || employee.position;
    employee.join_date = join_date || employee.join_date;
    employee.aadhaar_number = aadhaar_number || employee.aadhaar_number;
    employee.salary = salary || employee.salary;
    employee.employment_status = employment_status || employee.employment_status;

    //  Update image fields from uploaded files (Cloudinary)
    if (req.files && req.files['profile_photo']) {
      employee.profile_photo = req.files['profile_photo'][0].path; // Cloudinary URL
    }

    if (req.files && req.files['aadhaar_image']) {
      employee.aadhaar_image = req.files['aadhaar_image'][0].path; // Cloudinary URL
    }

    await employee.save();

    res.status(200).json({ message: 'Employee updated', employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Update failed' });
  }
};


module.exports = {registerEmployee, getAllEmployees, getEmployeeProfile, terminateEmployee, promoteEmployee, transferEmployee, updateEmployee, getAllTerminatedEmployees}
const { Attendance, Employee } = require('../model');
const moment = require('moment');

// Employee marks attendance
const markAttendance = async (req, res) => {
  try {
    let employeeId = req.user.id;
    let { date, check_in, check_out, status, remarks } = req.body;

    // Convert check_in and check_out if they exist and are in "hh:mma" format
    if (check_in) {
      check_in = moment(check_in, 'hh:mma').format('HH:mm:ss');
    }
    if (check_out) {
      check_out = moment(check_out, 'hh:mma').format('HH:mm:ss');
    }

    const record = await Attendance.create({
      employeeId,
      date,
      check_in,
      check_out,
      status: status || 'present',
      remarks: remarks || ''
    });

    res.status(201).json({ message: 'Attendance marked', attendance: record });
  } catch (err) {
    console.error('Attendance error:', err);
    res.status(500).json({ error: 'Could not mark attendance' });
  }
};



const getAllAttendance = async (req, res) => {
  try {
    const allAttendance = await Attendance.findAll({
      attributes: ['employeeId', 'date', 'check_in', 'status', 'check_out', 'remarks', 'createdAt'], // Attendance fields
      include: [{
        model: Employee,
        as: 'employee', // Must match alias in association
        attributes: ['employee_name'] // Just the name for now
      }]
    });

    res.status(200).json(allAttendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch attendance records' });
  }
};



module.exports = { markAttendance, getAllAttendance }
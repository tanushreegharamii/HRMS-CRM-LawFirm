const { LeaveRequest } = require('../model');
const {Employee} = require('../model')
// Employee applies for leave
const applyLeave = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { startDate, endDate, leave_type, reason } = req.body;

    const leave = await LeaveRequest.create({
      employeeId,
      startDate,
      endDate,
      leave_type,
      reason,
      status: 'pending'
    });

    res.status(201).json({ message: 'Leave request submitted', leave });
  } catch (err) {
    console.error('Leave error:', err);
    res.status(500).json({ error: 'Could not submit leave request' });
  }
};

// by admin only
const getAllLeaveRequests = async (req, res) => {
  try {
    const leaves = await LeaveRequest.findAll({
      attributes: [ 'id', 'employeeId', 'startDate', 'endDate', 'reason', 'status', 'createdAt'],
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['employee_name', 'phone', 'employee_id']
      }]
    });

    res.status(200).json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch leave requests' });
  }
};


const updateLeaveRequestStatus = async (req, res) => {
  try {
    // Expect the leave request ID to be passed as a URL parameter
    const { id } = req.params;
    // Expect the new status in the request body
    const { status } = req.body;

    // Validate that the provided status is one of the allowed values
    if (!['approved', 'denied'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "approved" or "denied".' });
    }

    // Find the leave request by primary key
    const leaveRequest = await LeaveRequest.findByPk(id);
    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found.' });
    }

    // Update the status field
    leaveRequest.status = status;
    await leaveRequest.save();

    res.status(200).json({ message: `Leave request ${status} successfully.`, leaveRequest });
  } catch (error) {
    console.error('Leave request status update error:', error);
    res.status(500).json({ error: 'Could not update leave request status.' });
  }
};



module.exports = {applyLeave, updateLeaveRequestStatus, getAllLeaveRequests}
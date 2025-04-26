const { Payroll } = require('../model');



// payrollController


const createPayroll = async (req, res) => {
  try {
    const {
      employeeId,
      baseSalary,
      bonus,
      deductions,
      monthYear,
      paidDate,
    } = req.body;

    //  Calculate net pay
    const netPay =
      parseFloat(baseSalary) + parseFloat(bonus || 0) - parseFloat(deductions || 0);

    // ✅ Check if payroll already exists for employee + month
    const existing = await Payroll.findOne({
      where: { employeeId, monthYear },
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: 'Payroll already exists for this employee and month' });
    }

    // ✅ Create new payroll
    const payroll = await Payroll.create({
      employeeId,
      baseSalary,
      bonus,
      deductions,
      netPay,
      monthYear,
      paidDate,
    });

    return res.status(201).json({ message: 'Payroll created', payroll });
  } catch (err) {
    console.error('Create payroll error:', err);
    return res.status(500).json({ error: 'Failed to create payroll' });
  }
};







// Admin creates/updates payroll for employee
const updatePayroll = async (req, res) => {
  try {
    const { employeeId, baseSalary, allowances, deductions, monthYear, paidDate } = req.body;

    const netPay = parseFloat(baseSalary) + parseFloat(allowances || 0) - parseFloat(deductions || 0);

    let payroll = await Payroll.findOne({ where: { employeeId } });
    if (payroll) {
      payroll.baseSalary = baseSalary;
      payroll.allowances = allowances;
      payroll.deductions = deductions;
      payroll.netPay = netPay;
      payroll.monthYear = monthYear;
      payroll.paidDate = paidDate;
      await payroll.save();
    } else {
      payroll = await Payroll.create({
        employeeId,
        baseSalary,
        allowances,
        deductions,
        netPay, 
        monthYear,
        paidDate
      });
    }

    res.status(200).json({ message: 'Payroll updated', payroll });
  } catch (err) {
    console.error('Payroll error:', err);
    res.status(500).json({ error: 'Could not update payroll' });
  }
};

module.exports = {updatePayroll, createPayroll}

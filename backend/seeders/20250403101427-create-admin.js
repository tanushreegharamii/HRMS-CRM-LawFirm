'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate a hashed password for the admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('yourAdminPassword', salt);

    // Insert an admin record into the Employees table.
    // Make sure the field names here match those in your Employees migration/model.
    await queryInterface.bulkInsert('Employees', [{
      employee_id: 'ADMIN001',              // A custom identifier for admin
      employee_name: 'Admin User',
      email: 'admin@hrm.com',
      phone: '1234567890',
      address: 'Admin Address',
      role: 'admin',                        // Important: this marks the record as admin
      department: 'Administration',
      join_date: new Date(),                // Or a specific date
      aadhaar_number: 'XXXXXXXXXXXX',
      profile_photo: '',
      aadhaar_image: '',
      salary: 0.00,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the admin record by its email or other unique field
    await queryInterface.bulkDelete('Employees', { email: 'admin@hrm.com' }, {});
  }
};

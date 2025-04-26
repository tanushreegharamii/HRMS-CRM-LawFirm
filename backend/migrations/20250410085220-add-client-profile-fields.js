'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Clients', 'profileImage', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Clients', 'caseName', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Clients', 'caseType', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Clients', 'advocateName', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Clients', 'caseDetails', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Clients', 'caseStatus', {
      type: Sequelize.ENUM('running', 'disposed'),
      allowNull: true
    });

    await queryInterface.addColumn('Clients', 'aadhaarCard', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Clients', 'caseDocuments', {
      type: Sequelize.JSON,
      allowNull: true
    });

    await queryInterface.addColumn('Clients', 'documentUploadTimestamps', {
      type: Sequelize.JSON,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Clients', 'profileImage');
    await queryInterface.removeColumn('Clients', 'caseName');
    await queryInterface.removeColumn('Clients', 'caseType');
    await queryInterface.removeColumn('Clients', 'advocateName');
    await queryInterface.removeColumn('Clients', 'caseDetails');
    await queryInterface.removeColumn('Clients', 'caseStatus');
    await queryInterface.removeColumn('Clients', 'aadhaarCard');
    await queryInterface.removeColumn('Clients', 'caseDocuments');
    await queryInterface.removeColumn('Clients', 'documentUploadTimestamps');
  }
};

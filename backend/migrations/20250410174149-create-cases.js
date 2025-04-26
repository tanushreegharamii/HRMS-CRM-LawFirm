'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Clients',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      advocateId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Advocates',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      caseName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      caseType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      caseStatus: {
        type: Sequelize.ENUM('running', 'disposed'),
        defaultValue: 'running'
      },
      caseDetails: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      aadhaarUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      documents: {
        type: Sequelize.JSON,
        allowNull: true
      },
      uploadedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cases');
  }
};

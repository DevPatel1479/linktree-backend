module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Referral', {
      referrerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      referredUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      dateReferred: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      status: {
        type: DataTypes.ENUM('pending', 'successful'),
        defaultValue: 'successful'
      }
    }, {
      timestamps: false
    });
  };
  
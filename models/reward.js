module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Reward', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      credits: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false
    });
  };
  
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    referralCode: {
      type: DataTypes.STRING,
      unique: true
    },
    referredBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false
  });

  // Before creating a user, generate a referral code if not provided
  User.beforeCreate((user) => {
    if (!user.referralCode) {
      // Use part of a UUID as a referral code
      user.referralCode = uuidv4().split('-')[0];
    }
  });

  return User;
};

const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Referral = require('./referral')(sequelize, Sequelize.DataTypes);
const Reward = require('./reward')(sequelize, Sequelize.DataTypes);

// Associations
// A user can have many referrals (as referrer)
User.hasMany(Referral, { foreignKey: 'referrerId', as: 'referrals' });
// A referral links a referrer to a referred user
Referral.belongsTo(User, { foreignKey: 'referrerId', as: 'referrer' });
Referral.belongsTo(User, { foreignKey: 'referredUserId', as: 'referredUser' });

// (Optional) A user can have one reward record
User.hasOne(Reward, { foreignKey: 'userId', as: 'reward' });
Reward.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, User, Referral, Reward };

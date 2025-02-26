const { Referral, User } = require('../models');

exports.getReferrals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const referrals = await Referral.findAll({
      where: { referrerId: userId },
      include: [{
        model: User,
        as: 'referredUser',
        attributes: ['username', 'email', 'createdAt']
      }]
    });
    res.json({ referrals });
  } catch (error) {
    next(error);
  }
};

exports.getReferralStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await Referral.count({ where: { referrerId: userId, status: 'successful' } });
    res.json({ referralCount: count });
  } catch (error) {
    next(error);
  }
};

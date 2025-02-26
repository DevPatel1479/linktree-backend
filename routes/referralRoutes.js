const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/referrals', protect, referralController.getReferrals);
router.get('/referral-stats', protect, referralController.getReferralStats);

module.exports = router;

    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const { User, Referral } = require('../models');
    const { sendResetEmail } = require('../utils/sendEmail');

    const saltRounds = 10;

    exports.register = async (req, res, next) => {
    try {
        const { email, username, password, referral } = req.body;
        
        if (!email || !username || !password) {
        return res.status(400).json({ message: 'Please provide email, username, and password.' });
        }
        
        // Basic email format validation
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
        }
        
        if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }
        
        // Check for duplicate email or username
        const { Op } = require('sequelize');
        const existingUser = await User.findOne({
        where: {
            [Op.or]: [{ email }, { username }]
        }
        });
        if (existingUser) {
        return res.status(400).json({ message: 'Email or username already in use.' });
        }
        
        let referredBy = null;
        if (referral) {
        const referrer = await User.findOne({ where: { referralCode: referral } });
        if (!referrer) {
            return res.status(400).json({ message: 'Invalid referral code.' });
        }
        referredBy = referrer.id;
        }
        
        // Hash password before storing
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({ email, username, passwordHash, referredBy });
        
        // Record referral if applicable
        if (referredBy) {
        await Referral.create({
            referrerId: referredBy,
            referredUserId: newUser.id,
            status: 'successful'
        });
        }
        
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        next(error);
    }
    };

    exports.login = async (req, res, next) => {
    try {
        const { emailOrUsername, password } = req.body;
        if (!emailOrUsername || !password) {
        return res.status(400).json({ message: 'Please provide credentials.' });
        }
        
        const { Op } = require('sequelize');
        const user = await User.findOne({
        where: {
            [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }]
        }
        });
        if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
        }
        
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
        }
        
        // Generate JWT token upon successful login
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
        });
        
        res.json({ token });
    } catch (error) {
        next(error);
    }
    };

    exports.forgotPassword = async (req, res, next) => {
        try {
          const { email } = req.body;
          if (!email) return res.status(400).json({ message: 'Please provide your email.' });
          
          const user = await User.findOne({ where: { email } });
          // Always return the same response to avoid account enumeration
          if (!user) {
            return res.status(200).json({ message: 'If an account exists, a reset link has been sent.' });
          }
          
          // Convert the environment variable to a number (milliseconds) and divide by 1000 for seconds.
          // Fallback to 3600 seconds (1 hour) if the env variable isn't set or isn't a number.
          const resetExpiry = process.env.RESET_PASSWORD_EXPIRES_IN
            ? Number(process.env.RESET_PASSWORD_EXPIRES_IN) / 1000
            : 3600;
            
          const resetToken = jwt.sign(
            { id: user.id },
            process.env.RESET_PASSWORD_TOKEN_SECRET,
            { expiresIn: "1h" }
          );
          
          // Simulate sending email (replace with real email service)
          await sendResetEmail(email, resetToken);
          
          res.status(200).json({ message: 'If an account exists, a reset link has been sent.' });
        } catch (error) {
          next(error);
        }
      };
      
    exports.resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
        return res.status(400).json({ message: 'Invalid request.' });
        }
        
        let payload;
        try {
        payload = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET);
        } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
        }
        
        const user = await User.findByPk(payload.id);
        if (!user) return res.status(400).json({ message: 'User not found.' });
        
        const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.passwordHash = newHashedPassword;
        await user.save();
        
        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        next(error);
    }
    };

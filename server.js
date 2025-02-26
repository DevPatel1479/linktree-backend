const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const referralRoutes = require('./routes/referralRoutes');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

const app = express();
app.use(express.json());

// Register API routes
app.use('/api', authRoutes);
app.use('/api', referralRoutes);

// Global error handling middleware
app.use(errorHandler);

// Sync database and start server
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

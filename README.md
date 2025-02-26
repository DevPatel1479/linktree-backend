**Linktree Backend with Referral System**

This project is a backend implementation for a platform similar to [Linktr.ee](https://linktr.ee/) or [Bento.me](https://bento.me/). It provides functionality for user registration, JWT authentication, password management, and a referral system. The backend is built using Node.js, Express, and MySQL (using Sequelize).

## Features

- **User Registration & Authentication**
  - Register with email, username, and password.
  - Input validation for email format, password strength, and duplicate users.
  - JWT-based authentication for secure user sessions.
  - Password reset mechanism with email verification and token expiration.

- **Referral System**
  - Each user is assigned a unique referral code upon registration.
  - Users can refer others using a referral link (e.g., `https://yourdomain.com/register?referral=REFERRAL_CODE`).
  - The system tracks the number of successful sign-ups from referral links.
  - (Optional) Additional reward logic for referrers.

- **Security & Scalability**
  - Secure password storage using bcrypt.
  - Protection against common vulnerabilities (SQL injection, XSS, CSRF).
  - Designed for high performance and scalability.

## Project Structure
1. **Clone the Repository**

   git clone https://github.com/DevPatel1479/linktree-backend.git
   cd linktree-backend

2. **Install Dependencies**
   npm install

3. **Set Up MySQL Database**

  Ensure MySQL is installed and running.
  Create a new database (e.g., linktree_db).

4. **Configure Environment Variables**

  Create a .env file in the project root with the following content (update with your credentials):

  PORT=5000
  DATABASE_URL=mysql://username:password@localhost:3306/linktree_db
  JWT_SECRET=mySuperSecretKey123!
  JWT_EXPIRES_IN=1h
  RESET_PASSWORD_TOKEN_SECRET=mySuperSecretKey123!
  RESET_PASSWORD_EXPIRES_IN=3600000   # in milliseconds (1 hour)
  

5. **Start the Server**

  npm start

## API Endpoints

 1. User Registration
    Endpoint: POST /api/register
    Description: Register a new user.

    Request Body:

    {
      "email": "user@example.com",
      "username": "myUsername",
      "password": "myPassword",
      "referral": "optionalReferralCode"
    }
    
 2. User Login
    Endpoint: POST /api/login
    Description: Authenticate a user and return a JWT token.

    Request Body:
    
    {
      "emailOrUsername": "user@example.com",
      "password": "myPassword"
    }

 3. Forgot Password
    Endpoint: POST /api/forgot-password
    Description: Send a password reset link to the user's email.

    Request Body:

   {
      "email": "user@example.com"
   }
   
 4. Reset Password
    Endpoint: POST /api/reset-password

    Description: Reset the user's password using a valid token.

    Request Body:

    {
      "token": "RESET_TOKEN_HERE",
      "newPassword": "NewSecurePassword"
    }

 5. Referral System
    a. Get Referred Users
       Endpoint: GET /api/referrals

       Description: Retrieve a list of users referred by the logged-in user.

       Headers:

        Authorization: Bearer JWT_TOKEN_HERE
       
    b. Get Referral Statistics
       Endpoint: GET /api/referral-stats

       Description: Retrieve statistics (e.g., total successful referrals) for the logged-in user.

       Headers:

        Authorization: Bearer JWT_TOKEN_HERE



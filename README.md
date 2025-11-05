# 📸 Pixisphere Backend API

> A professional photography marketplace connecting clients with verified photographers and studios. Built with Node.js, Express.js, and MongoDB.

[![Live API](https://img.shields.io/badge/Live%20API-Render-success)](https://pixisphere-api-backend.onrender.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.1.0-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v8.19.2-brightgreen)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

---

## 🚀 Live Demo

**Backend API:** https://pixisphere-api-backend.onrender.com/
**Health Check:** https://pixisphere-api-backend.onrender.com/api/healthcheck

---

## 📋 Table of Contents

- [About the Project](#about-the-project)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Project Flow](#project-flow)  
- [API Documentation](#api-documentation)  
- [Getting Started](#getting-started)  
- [Environment Variables](#environment-variables)  
- [Database Schema](#database-schema)  
- [Authentication](#authentication)  
- [Project Structure](#project-structure)  
- [Testing the API](#testing-the-api)  
- [Troubleshooting](#troubleshooting)  
- [Deployment](#deployment)  
- [Future Enhancements](#future-enhancements)  
- [Author](#author)  
- [License](#license)  
- [Acknowledgments](#acknowledgments)  
- [Support](#support)  

---

## 🎯 About the Project

Pixisphere is a comprehensive photography marketplace backend that facilitates seamless connections between clients seeking photography services and professional photographers/studios. The platform features role-based access control, automated lead matching, portfolio management, and review moderation.

### Key Highlights

- 🔐 **JWT-based Authentication** with OTP verification  
- 👥 **Multi-role System**: Client, Partner, Admin  
- 🤖 **Smart Lead Matching**: Automatic partner assignment based on location & category  
- 📊 **Admin Dashboard**: Partner verification, review moderation, marketplace analytics  
- 🖼️ **Portfolio Management**: Photographers showcase their work  
- ⭐ **Review System**: Client feedback with admin moderation  

---

## ✨ Features

### 🔒 Authentication & Authorization
- Email/Password login with bcrypt encryption  
- OTP-based authentication (mocked)  
- JWT access tokens (15 min expiry)  
- JWT refresh tokens (7 days expiry)  
- HttpOnly secure cookies  
- Role-based access control (RBAC)  

### 👤 For Clients
- Browse verified photographers by category & location  
- Submit photography inquiries with budget & event details  
- Receive matched partner recommendations  
- View partner portfolios & reviews  
- Submit reviews for completed services  

### 📷 For Partners (Photographers/Studios)
- Complete onboarding with business details & Aadhar verification  
- Create & manage photography portfolios  
- Receive matched leads based on service categories  
- Respond to client inquiries  
- View booking status & client information  

### 🛡️ For Admins
- Verify/reject partner applications  
- Moderate client reviews (approve/reject)  
- Manage service categories  
- Manage serviceable locations  
- View marketplace statistics  

---

## 🛠️ Tech Stack

**Backend Framework:**  
- Node.js (v18+)  
- Express.js (v5.1.0)  

**Database:**  
- MongoDB (v8.19.2)  
- Mongoose ODM  

**Authentication:**  
- JSON Web Tokens (JWT)  
- bcryptjs for password hashing  
- cookie-parser for token management  

**Validation & Security:**  
- Zod for schema validation  
- CORS enabled  
- Express error handling middleware  

**Development Tools:**  
- Nodemon for auto-restart  
- Prettier for code formatting  
- ES6 Modules  

---

## 🔄 Project Flow

1️⃣ **User Registration & Login**  
Client/Partner/Admin → `POST /api/auth/signup` → `POST /api/auth/login` (email/password or OTP) → Receives JWT tokens in HttpOnly cookies.  

2️⃣ **Partner Onboarding**  
Partner → `POST /api/partner/onboard` (business details, categories, location) → Status: "pending"  
Admin → `PUT /api/admin/verify/:id` (approve/reject) → Status: "verified" or "rejected".  

3️⃣ **Client Inquiry Flow**  
Client → `POST /api/inquiry` (e.g., `{ "category": "wedding", "city": "Delhi" }`)  
↓ System automatically matches verified partners: same category and city (case-insensitive).  
Partner → `GET /api/partner/leads` (view assigned inquiries) → `PUT /api/partner/leads/:id/respond` (respond to inquiry).  

4️⃣ **Portfolio & Reviews**  
Partner → `POST /api/partner/portfolio` (upload work samples) → Visible to clients.  
Client → `POST /api/reviews` (rating + comment) → Status: "pending".  
Admin → `PUT /api/admin/reviews/:id` (approve/reject) → Published reviews become visible.  

5️⃣ **Admin Operations**  
Admin → `GET /api/admin/stats` (dashboard metrics), `GET /api/admin/verifications` (pending partners) → `POST /api/admin/categories`, `POST /api/admin/locations` (manage categories/locations).  

---

## 📚 API Documentation

### Base URL
- Production: `https://pixisphere-api-backend.onrender.com/api`  
- Local: `http://localhost:8000/api`

---

### 🔐 Authentication Routes
**Base Path:** `/api/auth`

| Method | Endpoint      | Access    | Description                                |
| ------ | ------------- | --------- | ------------------------------------------ |
| POST   | `/signup`     | Public    | Register new user (client/partner/admin)   |
| POST   | `/login`      | Public    | Login with email & password                |
| POST   | `/send-otp`   | Public    | Send OTP to email (mocked)                 |
| POST   | `/verify-otp` | Public    | Verify OTP and authenticate                |
| POST   | `/refresh-token` | Public | Refresh access token                       |
| POST   | `/logout`     | Private   | Logout and clear tokens                    |
| GET    | `/profile`    | Private   | Get logged-in user profile                 |

**Sample Request (Register):**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "client",
  "phone": "9876543210"
}
```

---

### 📷 Partner Routes
**Base Path:** `/api/partner` (Private: Partner role only)

| Method | Endpoint        | Description                            |
| ------ | --------------- | -------------------------------------- |
| POST   | `/onboard`      | Submit partner profile for verification |
| GET    | `/profile`      | Get partner profile                    |
| PUT    | `/profile`      | Update partner profile                 |
| GET    | `/leads`        | Get matched inquiries (`?status=new`)   |
| GET    | `/leads/:id`    | Get specific lead details              |
| PUT    | `/leads/:id/respond` | Respond to inquiry              |
| POST   | `/portfolio`    | Add portfolio item                     |
| GET    | `/portfolio`    | Get all portfolio items                |
| PUT    | `/portfolio/:id`| Update portfolio item                  |
| DELETE | `/portfolio/:id`| Delete portfolio item                  |

**Sample Request (Onboard):**
```http
POST /api/partner/onboard
Content-Type: application/json

{
  "businessName": "Fashion Studio",
  "serviceCategories": ["wedding", "corporate", "product photography"],
  "city": "Delhi",
  "state": "Delhi",
  "aadharNumber": "123456789012",
  "documentMetadata": {
    "gstNumber": "22AAAAA0000A1Z5",
    "panNumber": "ABCDE1234F"
  },
  "samplePortfolioUrls": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ]
}
```

---

### 📝 Inquiry Routes
**Base Path:** `/api/inquiry` (Private: Client role only)

| Method | Endpoint         | Description                       |
| ------ | ---------------- | --------------------------------- |
| POST   | `/`              | Create inquiry (auto-matches partners) |
| GET    | `/`              | Get all client inquiries (`?status=new`) |
| GET    | `/stats`         | Get inquiry statistics by status  |
| GET    | `/:id`           | Get specific inquiry details      |
| PUT    | `/:id/status`    | Update inquiry status             |
| DELETE | `/:id`           | Delete inquiry                   |

**Sample Request (Create Inquiry):**
```http
POST /api/inquiry
Content-Type: application/json

{
  "category": "wedding",
  "eventDate": "2025-12-25",
  "budget": 50000,
  "city": "Delhi",
  "referenceImageUrl": "https://example.com/ref.jpg",
  "description": "Looking for wedding photographer for outdoor ceremony"
}
```

---

### ⭐ Review Routes
**Base Path:** `/api/reviews`

| Method | Endpoint      | Access               | Description                           |
| ------ | ------------- | -------------------- | ------------------------------------- |
| GET    | `/`           | Public               | Get partner reviews (`?partnerId=xyz`) |
| POST   | `/`           | Private (Client)     | Submit review for partner              |
| GET    | `/my-reviews` | Private (Client)     | Get client's own reviews               |
| DELETE | `/:id`        | Private (Client)     | Delete own review                      |

**Sample Request (Submit Review):**
```http
POST /api/reviews
Content-Type: application/json

{
  "partnerId": "6909eaa38ecb265c5fb5e854",
  "inquiryId": "690a279e6c8359d7a11b3b86",
  "rating": 5,
  "comment": "Excellent wedding photography! Very professional."
}
```

---

### 🛡️ Admin Routes
**Base Path:** `/api/admin` (Private: Admin role only)

#### Dashboard & Stats
| Method | Endpoint   | Description             |
| ------ | ---------- | ----------------------- |
| GET    | `/stats`   | Get dashboard statistics |

#### Partner Verification
| Method | Endpoint        | Description                          |
| ------ | --------------- | ------------------------------------ |
| GET    | `/verifications`| Get pending partner verifications    |
| PUT    | `/verify/:id`   | Approve/reject partner               |

#### Review Moderation
| Method | Endpoint        | Description                    |
| ------ | --------------- | ------------------------------ |
| GET    | `/reviews`      | Get all reviews (`?status=pending`) |
| PUT    | `/reviews/:id`  | Approve/reject review         |
| DELETE | `/reviews/:id`  | Delete review                 |

#### Categories Management
| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/categories`    | Get all categories   |
| POST   | `/categories`    | Create new category  |
| PUT    | `/categories/:id`| Update category      |
| DELETE | `/categories/:id`| Delete category      |

#### Locations Management
| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/locations`    | Get all locations    |
| POST   | `/locations`    | Create new location  |
| PUT    | `/locations/:id`| Update location      |
| DELETE | `/locations/:id`| Delete location      |

**Sample Request (Verify Partner):**
```http
PUT /api/admin/verify/:partnerId
Content-Type: application/json

{
  "status": "verified",
  "comment": "All documents verified successfully"
}
```

---

### 🌐 Public Routes
**Base Path:** `/api`

| Method | Endpoint        | Access | Description                     |
| ------ | --------------- | ------ | ------------------------------- |
| GET    | `/partners`     | Public | Browse all verified partners    |
| GET    | `/partners/:id` | Public | Get partner public profile      |
| GET    | `/healthcheck`  | Public | API health status               |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)  
- MongoDB (local or Atlas)  
- npm or yarn  
- Git  

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/pixisphere-backend.git
cd pixisphere-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment file**

```bash
cp .env.example .env
```

4. **Configure environment variables** (see section below)

5. **Start MongoDB** (if using local instance)

```bash
mongod
```

6. **Run the application**

- Development mode (with auto-reload): `npm run dev`  
- Production mode: `npm start`  

The server will start on `http://localhost:8000`.

---

## 🔧 Environment Variables

Create a `.env` file in the root directory and set the following:

```bash
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/pixisphere
# Or MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pixisphere

# JWT Secrets (use strong random strings in production)
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_min_32_chars
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_min_32_chars

# JWT Expiry
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000  # In production, set to your frontend domain

# Optional: Email Service (for real OTP)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
```

**Security Note:** Never commit `.env` to version control; keep it in `.gitignore`.

---

## 🗄️ Database Schema

### Collections

1. **users** – Authentication & user profiles  
2. **partners** – Photographer/studio business profiles  
3. **inquiries** – Client service requests  
4. **portfolios** – Partner work samples  
5. **reviews** – Client feedback & ratings  
6. **categories** – Service types (wedding, corporate, etc.)  
7. **locations** – Serviceable cities  

### Key Relationships

- User (1) ←→ (1) Partner  
- User (1) ←→ (N) Inquiry (as client)  
- Partner (1) ←→ (N) Inquiry (as assigned partner)  
- Partner (1) ←→ (N) Portfolio  
- Partner (1) ←→ (N) Review  
- User (client) (1) ←→ (N) Review  

---

## 🔐 Authentication

This API uses **JWT-based authentication** with HttpOnly cookies.

### Flow:

1. User registers/logs in → Server generates access & refresh tokens.  
2. Tokens stored in HttpOnly cookies (secure, prevents XSS).  
3. Client includes cookies in subsequent requests.  
4. Middleware verifies token & attaches user to `req.user`.  
5. Role-based checks ensure only permitted roles access specific resources.

### Token Expiry:

- **Access Token:** 15 minutes  
- **Refresh Token:** 7 days  

### Making Authenticated Requests:

**Option 1:** Cookies (automatic in browser)

```js
// Browser example (cookies sent automatically)
fetch('http://localhost:8000/api/partner/profile', { credentials: 'include' });
```

**Option 2:** Authorization Header (for Postman or mobile)

```
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```

---

## 📁 Project Structure

```
pixisphere-backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── user.controller.js
│   │   ├── partner.controller.js
│   │   ├── inquiry.controller.js
│   │   ├── review.controller.js
│   │   └── admin.controller.js
│   ├── models/             # MongoDB schemas
│   │   ├── User.model.js
│   │   ├── Partner.model.js
│   │   ├── Inquiry.model.js
│   │   ├── Portfolio.model.js
│   │   ├── Review.model.js
│   │   ├── Category.model.js
│   │   └── Location.model.js
│   ├── routes/             # API routes
│   │   ├── user.routes.js
│   │   ├── partner.routes.js
│   │   ├── inquiry.routes.js
│   │   ├── review.routes.js
│   │   ├── admin.routes.js
│   │   ├── public.routes.js
│   │   └── healthcheck.routes.js
│   ├── middlewares/        # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── errorHandler.js
│   ├── utils/              # Helper functions
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── asyncHandler.js
│   ├── app.js              # Express app configuration
│   └── index.js            # Server entry point
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

---

## 🧪 Testing the API

### Using Postman

1. Import the API collection (if provided).  
2. Set base URL: `http://localhost:8000/api`.  
3. Test authentication flow:  
   - Register → Login → Copy access token.  
   - Add token to Authorization header or cookies.  
4. Test protected routes with different roles.

### Sample Testing Flow

```bash
# 1. Health check
curl http://localhost:8000/api/healthcheck

# 2. Register a new client
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","role":"client"}'

# 3. Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 4. Access protected route (use token from login response)
curl http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🐛 Troubleshooting

**MongoDB Connection Failed**  
- Ensure MongoDB is running (`mongod`).  
- Check `MONGODB_URI` in `.env`.  
- For MongoDB Atlas: whitelist your IP address.

**JWT Token Errors**  
- Verify `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are set.  
- Check if the token has expired (15 min for access tokens).  
- Use `/api/auth/refresh-token` to obtain a new access token.

**CORS Errors**  
- Set correct `CORS_ORIGIN` in `.env`.  
  - Development: `http://localhost:3000`  
  - Production: your actual frontend domain.

**Port Already in Use**  
- Change `PORT` in `.env` (e.g., to 8080).  
- Or kill the process using port 8000.

---

## 🚢 Deployment

### Deploying to Render

1. Push code to GitHub.  
2. Create a new Web Service on Render.  
3. Connect your repository.  
4. Set environment variables in Render's dashboard.  
5. Deploy!

**Build Command:** `npm install`  
**Start Command:** `npm start`

---

## 📈 Future Enhancements

- [ ] Real-time notifications (Socket.io)  
- [ ] Payment integration (Razorpay/Stripe)  
- [ ] Email notifications (Nodemailer)  
- [ ] SMS OTP (Twilio)  
- [ ] Image upload (Cloudinary/AWS S3)  
- [ ] Advanced search filters  
- [ ] Booking calendar system  
- [ ] Chat between client & partner  
- [ ] Analytics dashboard for partners  
- [ ] API rate limiting  

---

## 👨‍💻 Author

**Shehbaz khan**  

[LinkedIn](https://www.linkedin.com/in/shehbazlovedev/)  
[Twitter](https://x.com/MdShehbazkhan)  
[GitHub](https://github.com/Shehbaz456)

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 🙏 Acknowledgments

- Express.js documentation  
- MongoDB documentation  
- JWT for token debugging  
- Postman for API testing  
- Render for hosting  

---

## 📞 Support

For issues, questions, or suggestions:  

- Open an issue on GitHub.  
- Connect on LinkedIn: https://www.linkedin.com/in/shehbazlovedev/  
- Follow on Twitter: https://x.com/MdShehbazkhan 

---

**⭐ If you find this project helpful, please give it a star!**  

Made with ❤️ by Shehbaz khan (https://www.linkedin.com/in/shehbazlovedev/)

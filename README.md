# 📰 Post Blog API

A feature-rich, scalable backend API for a blogging platform built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. It supports user authentication, blog and post management, comments, likes, and more — all structured using SOLID principles and dependency injection via **InversifyJS**.

---

## 🚀 Features

- 🔐 User Registration & Login with JWT
- 📚 Blog and Post CRUD
- 💬 Commenting System with Like/Dislike
- 🔁 Refresh Token Rotation
- 📱 Session Management by Device
- 🧪 E2E Testing with Jest & Supertest
- 📦 Type-safe, modular code with InversifyJS
- 📧 Email confirmation via Nodemailer / Resend
- 🛡️ Input Validation & Error Handling

---

## 🧱 Architecture Overview

The project follows a **modular layered architecture**, ensuring separation of concerns and testability:

```
src/
├── application/       # Use-cases / services coordinating business logic
├── controllers/       # Request handlers (Express route handlers)
├── domain/            # Core domain models and interfaces
├── functions/         # Utility functions
├── infrastructure/    # External integrations (DB, Email, etc.)
├── middlewares/       # Express middleware for auth, errors, etc.
├── models/            # Mongoose models and schemas
├── routers/           # Route definitions for each module
├── types/             # Global TypeScript types and enums
```

✅ Based on principles like **SOLID**, **Inversion of Control**, and **Single Responsibility**, all major modules are decoupled and testable with **InversifyJS** DI container.

---

## 📌 REST API Endpoints

### 🔐 Auth & Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/registration` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/refresh-token` | Get new tokens |
| POST | `/auth/logout` | Logout from current session |
| POST | `/auth/registration-email-resending` | Resend confirmation email |
| POST | `/auth/registration-confirmation` | Confirm email registration |

### 👤 Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get users with filters and pagination |
| DELETE | `/users/:id` | Delete user by ID (admin only) |

### 📒 Blogs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/blogs` | List all blogs |
| POST | `/blogs` | Create new blog |
| GET | `/blogs/:id` | Get blog by ID |
| PUT | `/blogs/:id` | Update blog |
| DELETE | `/blogs/:id` | Delete blog |

### 📝 Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Get all posts |
| POST | `/posts` | Create a post |
| GET | `/posts/:id` | Get a single post |
| PUT | `/posts/:id` | Update a post |
| DELETE | `/posts/:id` | Delete a post |
| GET | `/blogs/:id/posts` | Get posts from specific blog |
| POST | `/posts/:id/comments` | Add comment to a post |

### 💬 Comments & Likes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/comments/:id` | Get comment by ID |
| PUT | `/comments/:id` | Edit comment |
| DELETE | `/comments/:id` | Delete comment |
| PUT | `/comments/:id/like-status` | Like/dislike a comment |
| PUT | `/posts/:id/like-status` | Like/dislike a post |

### 📱 Devices & Security

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/security/devices` | List all active sessions |
| DELETE | `/security/devices` | Terminate all sessions except current |
| DELETE | `/security/devices/:id` | Terminate specific session |

### 🧪 Testing

| Method | Endpoint | Description |
|--------|----------|-------------|
| DELETE | `/testing/all-data` | Wipe all DB content (test only) |

---

## ⚙️ Installation

```bash
git clone https://github.com/yourusername/post_blog_api.git
cd post_blog_api
npm install
cp .env.example .env
```

---

## 🧾 Environment Variables

Create a `.env` file and define:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
MONGO_URI=mongodb://localhost:27017/blogdb
EMAIL_USER=you@example.com
EMAIL_PASS=your_email_password
BASE_URL=http://localhost:5000
```

---

## 💻 Development

```bash
npm run watch       # Compile TS in watch mode
npm run dev         # Start with nodemon and inspector
```

## 🧪 Testing

```bash
npm run jest             # Run all tests
npm run jest:coverage    # Run tests with coverage
```

---

## 📃 License

This project is licensed under the MIT License.

## 👤 Author

**Bohdan Biliak**  
[bohdan.biliak.detrox@gmail.com]

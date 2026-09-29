# TRS

### A modern web platform built with React, Node.js and MongoDB

**TRS** is a full-stack web application designed with a modern, interactive interface and a scalable backend architecture.

The project is currently **live and actively used by around 40 users**, making it more than just a development/demo project.

🌐 **Live Website:** https://trs-zeta.vercel.app/
💻 **Source Code:** https://github.com/prashantgangani/TRS

---

## ✨ Features

* 🔐 **User Authentication**

  * User registration and login
  * JWT-based authentication
  * Secure password hashing with bcrypt

* 👤 **User Management**

  * User accounts and authenticated sessions
  * Protected application functionality

* 🎨 **Modern Interactive UI**

  * Responsive React interface
  * Smooth animations and transitions
  * Interactive 3D elements
  * Modern navigation and component-based architecture

* ☁️ **Cloud Media Handling**

  * Cloudinary integration for media storage and management

* 🔒 **Backend Security**

  * Helmet security middleware
  * CORS configuration
  * Environment-variable based configuration

* 📱 **Responsive Design**

  * Designed to work across desktop and mobile devices

* ⚡ **Fast Development & Deployment**

  * Vite-powered frontend
  * Node.js/Express backend
  * Production deployment support

---

## 🛠️ Tech Stack

### Frontend

| Technology        | Purpose                     |
| ----------------- | --------------------------- |
| React             | UI development              |
| Vite              | Development & build tooling |
| React Router      | Client-side routing         |
| Tailwind CSS      | Styling                     |
| Framer Motion     | Animations                  |
| Three.js          | 3D graphics                 |
| React Three Fiber | React-based 3D rendering    |
| React Three Drei  | Three.js helpers            |
| Lucide React      | Icons                       |

### Backend

| Technology | Purpose                   |
| ---------- | ------------------------- |
| Node.js    | Runtime environment       |
| Express.js | Backend/API framework     |
| MongoDB    | Database                  |
| Mongoose   | MongoDB ODM               |
| JWT        | Authentication            |
| bcrypt.js  | Password hashing          |
| Multer     | File uploads              |
| Cloudinary | Cloud media storage       |
| Helmet     | HTTP security             |
| CORS       | Cross-origin requests     |
| dotenv     | Environment configuration |

---

## 🏗️ Project Structure

```text
TRS/
│
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node.js / Express backend
│   ├── ...
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

Follow the steps below to run TRS locally.

### 1. Clone the repository

```bash
git clone https://github.com/prashantgangani/TRS.git
```

```bash
cd TRS
```

---

## 💻 Frontend Setup

Navigate to the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the Vite development URL shown in your terminal.

---

## ⚙️ Backend Setup

Open another terminal and navigate to the server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Never commit your `.env` file or expose your API keys and secrets.**

Start the backend in development mode:

```bash
npm run dev
```

Or start the production server with:

```bash
npm start
```

---

## 🔐 Authentication

TRS uses **JWT (JSON Web Tokens)** for authentication and **bcrypt.js** for password hashing.

The authentication flow is:

```text
User
  │
  ▼
Login / Register
  │
  ▼
Express API
  │
  ├── bcrypt → Password verification
  │
  └── JWT → Authentication token
          │
          ▼
     Protected Routes
```

---

## 🌐 Deployment

The project is structured as a separate frontend and backend application, allowing each part to be deployed independently.

### Frontend

The React application can be built using:

```bash
npm run build
```

### Backend

The Express server can be started using:

```bash
npm start
```

Environment variables should be configured through the hosting provider rather than committing secrets to the repository.

---

## 📊 Project Status

**Status: 🟢 Live**

TRS is currently deployed and actively used.

> 👥 **~40 live users**

This project is continuously being improved with new features, UI enhancements and performance improvements.

---

## 🎯 Purpose

TRS was built as a practical full-stack application with a focus on:

* Building a real-world React application
* Designing REST-style backend services
* Implementing authentication and authorization
* Working with MongoDB
* Handling cloud-based media
* Creating interactive and animated user interfaces
* Deploying and maintaining a live application
* Learning how frontend and backend systems work together in production

---

## 🔮 Future Improvements

Possible future improvements include:

* [ ] Improved analytics and monitoring
* [ ] Additional user features
* [ ] Performance optimizations
* [ ] Enhanced mobile experience
* [ ] More interactive UI components
* [ ] Improved security and validation
* [ ] Automated testing
* [ ] CI/CD integration

---

## 👨‍💻 Developer

**Prashant Gangani**

Full-Stack Developer

GitHub:
https://github.com/prashantgangani

---

## ⭐ Support

If you find the project interesting, consider giving the repository a ⭐ on GitHub.

Your feedback and suggestions are always welcome.

---

### 📌 TRS

**Built with React + Node.js + MongoDB**

**Live • Interactive • Continuously Evolving**

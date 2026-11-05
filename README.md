# 🛒 MegaMart - Modern Full-Stack E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Demo-Live_Website-22c55e?style=for-the-badge&logo=render)](https://megamart-iyre.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/sahaniTripurari/MegaMartWeb)

A robust, full-featured web-based e-commerce platform designed to deliver smooth shopping experiences with dynamic product management, cart workflows, user authentication, and responsive user interfaces.

---

## 🌟 Key Features

- 🛍️ **Interactive Product Catalog**: Real-time filtering, search, and categorized views.
- 🛒 **Smart Shopping Cart**: Add, update quantity, remove items, and calculate totals in real-time.
- 🔐 **User Authentication**: Secure signup/login and session management.
- 📱 **Mobile-First Responsive UI**: Clean experience across smartphones, tablets, and desktops.
- ⚡ **RESTful API Backend**: Scalable Express and Node.js architecture with MVC folder organization.
- 🗄️ **Database Persistence**: MongoDB data models for products, orders, and users.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Modern JavaScript (ES6+), CSS3, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Deployment**: Render

---

## 📁 Project Structure

```
MegaMartWeb/
├── controller/         # Request handling & business logic
├── model/              # MongoDB Schemas & models
├── view/               # Frontend template views & pages
├── public/             # Static assets, styles, and scripts
├── main.js             # Main client script
├── server.js           # Express server entry point
└── package.json        # Dependencies and scripts
```

---

## 🚀 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sahaniTripurari/MegaMartWeb.git
   cd MegaMartWeb
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the application:**
   ```bash
   npm start
   # Or for development:
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:5000`

---

## 👨‍💻 Author
- **Tripurari Sahni** ([@sahaniTripurari](https://github.com/sahaniTripurari))

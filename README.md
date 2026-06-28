# Task Tracker - MERN Stack Application

A full-stack Task Tracker web application built using the MERN stack (MongoDB, Express, React, Node.js).  
This project was developed as part of a technical assignment to demonstrate full-stack development skills.

---

## 🚀 Live Demo
Frontend: https://task-tracker-nu-woad.vercel.app

Backend API: https://task-tracker-8kcj.onrender.com

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Axios
- React Context API

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- CORS
- Dotenv

---

## ✨ Features

- Create, Read, Update, Delete (CRUD) tasks
- Task priorities (Low, Medium, High)
- Task status (Pending, In Progress, Completed)
- Due date tracking
- Dashboard with analytics
  - Total tasks
  - Completed tasks
  - Pending tasks
  - Overdue tasks
  - Completion rate
- Recent activity tracking
- Responsive UI
- Real-time updates without refresh
- REST API integration
- Clean modular structure

---

## 📁 Project Structure

task-tracker/
├── client
├── server
└── README.md

---

## ⚙️ Setup

### Backend
cd server
npm install
npm run dev

.env:
PORT=5001
MONGO_URI=your_mongo_connection_string

---

### Frontend
cd client
npm install
npm run dev

---

## 🔌 API

GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

---

## 👨‍💻 Author
MERN Stack Assignment Project

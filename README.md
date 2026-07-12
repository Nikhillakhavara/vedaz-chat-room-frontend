# 💬 Vedaz Chat Room - Frontend

A modern real-time chat application built with **React**, **TypeScript**, **Vite**, and **Socket.IO Client**. The application connects to a Node.js + Express backend using REST APIs and Socket.IO to provide instant messaging.

## 🚀 Live Demo

Frontend: https://vedaz-chat-room-frontend.vercel.app

Backend API: https://vedaz-chat-room-backend.onrender.com

---

## 📌 Features

- ✅ Real-time messaging using Socket.IO
- ✅ Fetch previous chat history
- ✅ Display message timestamps
- ✅ Online user list
- ✅ Typing indicator
- ✅ Username-based login (dummy authentication)
- ✅ Responsive and clean UI
- ✅ REST API integration using Fetch API
- ✅ Automatic Socket.IO reconnection

---

## 🛠 Tech Stack

- React 19
- TypeScript
- Vite
- Socket.IO Client
- Fetch API
- CSS

---

## 📂 Project Structure

```
frontend/
│
├── src/
│   ├── components/
│   │   ├── ChatWindow.tsx
│   │   ├── LoginScreen.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   └── socket.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
│
├── public/
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Nikhillakhavara/vedaz-chat-room-frontend.git
```

Go to project directory

```bash
cd vedaz-chat-room-frontend
```

Install dependencies

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory.

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

For production

```env
VITE_API_URL=https://vedaz-chat-room-backend.onrender.com/api
VITE_SOCKET_URL=https://vedaz-chat-room-backend.onrender.com
```

---

## ▶️ Run Development Server

```bash
npm run dev
```

Application runs at

```
http://localhost:5173
```

---

## 📦 Build

```bash
npm run build
```

---

## 🌐 Deployment

The frontend is deployed on **Vercel**.

Live URL

```
https://vedaz-chat-room-frontend.vercel.app
```

---

## 🔌 REST APIs Used

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/messages` | Fetch chat history |
| POST | `/api/messages` | Send new message |
| GET | `/api/users` | Get online users |
| POST | `/api/messages/read` | Mark messages as read |

---

## ⚡ Socket.IO Events

### Client → Server

```
user:join
message:send
typing:status
message:read_all
```

### Server → Client

```
message:received
typing:update
user_list:update
messages:marked_read
```

---

## 📸 Screenshots

Add application screenshots here.

Example

```
screenshots/
    login.png
    chat.png
```

---

## 🎯 Design Decisions

- React + Vite chosen for fast development and optimized builds.
- Fetch API used instead of Axios to keep dependencies minimal.
- Socket.IO used for instant communication.
- REST APIs used to fetch existing chat history.
- Environment variables used for API and Socket server configuration.
- Modular folder structure for better maintainability.

---

## 📋 Assumptions

- Username authentication is dummy and does not require a password.
- Messages are stored on the backend.
- Internet connection is required for real-time communication.
- Backend service must be running before starting the frontend.

---

## 👨‍💻 Author

**Nikhil Lakhavara**

GitHub

https://github.com/Nikhillakhavara

---

## 📄 License

This project is developed as part of a Full Stack Developer assignment.
# Pulse Chat - Frontend

A modern, real-time chat application frontend built with React, Vite, TypeScript, and Socket.io client. Features a beautiful UI with Tailwind CSS, real-time messaging, typing indicators, and dual communication protocols (WebSocket + REST API).

---

## 🚀 Tech Stack

- **React 19** - Modern UI framework
- **Vite** - Lightning-fast build tool and dev server
- **TypeScript** - Type-safe development
- **Socket.io Client** - Real-time bidirectional communication
- **Tailwind CSS 4** - Utility-first styling
- **Motion (Framer Motion)** - Smooth animations
- **Lucide React** - Beautiful icon set

---

## 📁 Project Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── ChatWindow.tsx       # Main chat interface with message stream
│   │   ├── LoginScreen.tsx      # User authentication/join screen
│   │   └── Sidebar.tsx          # Online users panel with status
│   ├── services/
│   │   ├── api.ts               # REST API communication layer
│   │   └── socket.ts            # WebSocket client instance
│   ├── App.tsx                  # Root component with state management
│   ├── main.tsx                 # Application entry point
│   ├── index.css                # Global styles and Tailwind imports
│   └── types.ts                 # TypeScript type definitions
├── index.html                   # HTML template
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
├── .env.example                 # Environment variables template
└── .env                         # Local environment configuration
```

---

## 🔧 Environment Configuration

Create a `.env` file in the `frontend/` directory:

```env
# Backend API endpoint
VITE_API_URL=http://localhost:3000

# WebSocket server endpoint
VITE_SOCKET_URL=http://localhost:3000
```

**Note:** Both URLs point to the same backend server (port 3000) which handles both REST and WebSocket connections.

---

## 📦 Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

---

## 🏃 Running the Application

### Development Mode (Standalone)

Run the frontend independently on port 5173:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

**Important:** Make sure the backend server is running on port 3000 for full functionality.

### Development Mode (Integrated)

The recommended way is to run from the root directory, which starts both frontend and backend together:

```bash
# From project root
npm run dev
```

The backend serves the frontend through Vite middleware on `http://localhost:3000`

---

## 🏗️ Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory with:
- Minified JavaScript bundles
- Optimized CSS
- Compressed assets
- Source maps for debugging

---

## ✨ Features

### Real-Time Communication
- **Dual Protocol Support**: Switch between WebSocket and REST API for message sending
- **Live Typing Indicators**: See when other users are typing
- **Message Status**: Sent, delivered, and read receipts (WhatsApp-style)
- **Online User Directory**: Real-time list of connected users

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Search Messages**: Filter chat history by content or username
- **Date Separators**: Organized message grouping by date
- **Smooth Animations**: Powered by Motion for fluid transitions
- **Avatar System**: Color-coded user avatars with initials

### Message Features
- **Message History**: Persistent chat history loaded on join
- **Smart Scrolling**: Auto-scroll for new messages, manual scroll for history
- **System Messages**: Special formatting for system notifications
- **Time Stamps**: Human-readable time display for each message

---

## 🎨 UI Components

### ChatWindow
Main chat interface featuring:
- Message stream with auto-scroll
- Dual protocol switcher (WebSocket/REST)
- Message search functionality
- Input field with typing detection
- Send method indicator

### LoginScreen
Clean authentication interface:
- Username input with validation
- Animated welcome screen
- Persistent session storage

### Sidebar
User management panel:
- Online users list with status indicators
- Connection status badge
- Logout functionality
- Responsive mobile drawer

---

## 🔌 API Integration

### REST Endpoints

**Get Messages**
```typescript
GET /api/messages
Response: { success: boolean, messages: Message[] }
```

**Send Message**
```typescript
POST /api/messages
Body: { username: string, text: string }
Response: { success: boolean, message: Message }
```

**Get Online Users**
```typescript
GET /api/users
Response: { success: boolean, users: User[] }
```

**Mark Messages as Read**
```typescript
POST /api/messages/read
Body: { username: string }
Response: { success: boolean }
```

### WebSocket Events

**Client Emits**
- `user:join` - Join the chat room
- `message:send` - Send a new message
- `typing:status` - Update typing status
- `message:read_all` - Mark all messages as read

**Client Listens**
- `connect` / `disconnect` - Connection status
- `message:received` - New message broadcast
- `user_list:update` - Online users update
- `typing:update` - Typing status change
- `messages:marked_read` - Read receipt update

---

## 🛠️ Development Tools

### TypeScript Configuration
Strict type checking enabled with:
- React JSX support
- Module resolution for imports
- Path aliases configured
- ES2020 target

### Vite Configuration
Optimized for development with:
- Fast Hot Module Replacement (HMR)
- React plugin for Fast Refresh
- Tailwind CSS integration
- Port 5173 dev server (standalone mode)

---

## 📚 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.1 | UI framework |
| socket.io-client | ^4.8.3 | Real-time communication |
| tailwindcss | ^4.1.14 | Styling framework |
| motion | ^12.23.24 | Animations |
| lucide-react | ^0.546.0 | Icon library |
| vite | ^6.2.3 | Build tool |
| typescript | ~5.8.2 | Type safety |

---

## 🐛 Troubleshooting

### Connection Issues
- Verify backend is running on port 3000
- Check `.env` file for correct URLs
- Ensure no CORS issues (use integrated mode)

### Messages Not Appearing
- Check browser console for errors
- Verify WebSocket connection status
- Ensure backend database is initialized

### Styling Issues
- Run `npm install` to ensure Tailwind is installed
- Check that `@tailwindcss/vite` plugin is active
- Clear browser cache and rebuild

---

## 📄 License

This project is part of the Pulse Chat application suite.

---

## 🤝 Contributing

When contributing to the frontend:
1. Follow the existing component structure
2. Maintain TypeScript strict mode compliance
3. Use Tailwind CSS for styling
4. Keep components focused and reusable
5. Test on multiple screen sizes

---

**Built with ❤️ using React, Vite, and Socket.io**

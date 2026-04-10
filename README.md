# Videotube 📺

A modern, full-stack video hosting platform built with the MERN stack (MongoDB, Express, React, Node.js). This project features a robust backend for managing media assets via Cloudinary and a sleek, responsive frontend built with React and Tailwind CSS.

## 🚀 Key Features

- **User Authentication**: Secure signup and login using JWT and bcrypt.
- **Video Management**: Upload, publish, and manage videos with Cloudinary integration.
- **Interactions**: Like, comment, and subscribe to channels.
- **Playlists**: Create and manage personalized video playlists.
- **Dashboard**: User-specific analytics and video management.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: Server-side logic and API routing.
- **MongoDB & Mongoose**: NoSQL database for flexible data storage.
- **Cloudinary**: Media hosting and optimization.
- **Multer**: Middleware for handling multipart/form-data (file uploads).
- **JWT**: Secure token-based authentication.

### Frontend
- **React**: Modern UI library with functional components and hooks.
- **Vite**: Fast build tool and dev server.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **Framer Motion**: Smooth animations and transitions.
- **Lucide React**: Beautifully simple pixel-perfect icons.
- **Axios**: Promise-based HTTP client for API requests.

## 📂 Project Structure

```text
/
├── backend/            # Express server and backend logic
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── public/
└── frontend/           # React frontend (Vite)
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── api/
```

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Rex1671/videotube.git
cd videotube
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory and add the following:
```env
PORT=8000
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```
Run the backend in development mode:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Run the frontend in development mode:
```bash
npm run dev
```

## 📜 Scripts

### Backend
- `npm run dev`: Starts the server with `nodemon`.
- `npm test`: Runs the test suite using `jest`.

### Frontend
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Locally previews the production build.

---
Built with ❤️ by [Rex1671](https://github.com/RakeshRautDev)

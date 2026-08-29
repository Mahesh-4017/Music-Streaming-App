# 🎵 Musify — Premium 3D Music Streaming Platform

<div align="center">

![Musify Logo](https://img.shields.io/badge/Musify-Tuscan_Sunset-FF6B6B?style=for-the-badge&logo=musicbrainz&logoColor=white)
![Next.js 16](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Deployed on Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

**Experience music streaming reinvented with interactive 3D visuals, high-fidelity audio playback, and instant YouTube metadata integration.**

---

### 🌐 Live Production Deployment
👉 **[Launch Musify Web App](https://music-streaming-app-03.netlify.app/)**

</div>

---

## ✨ Features & Visual Highlights

### 🎨 1. Interactive 3D Visual Experience
* **3D Mouse-Tracking Tilt**: Dynamic hero cards respond in real-time to cursor movements with perspective rotation (`rotateX`/`rotateY`).
* **Spinning Vinyl Album Cards**: Interactive cards that reveal a rotating vinyl disc on hover.
* **Holographic Soundwaves & Vibe Radar**: Ambient lighting and mood-based filters for immediate music discovery.

### 🎧 2. Audio Engine & Library Management
* **YouTube & Audio Streaming**: Automatically fetches titles, thumbnails, and clean metadata from YouTube URLs.
* **Custom Playlists & Folders**: Full folder organization with user-created music lists.
* **Persistent Liked Songs**: Manage favorite tracks across sessions with offline IndexedDB fallback.

### 🔒 3. Fail-Safe Enterprise Authentication
* **Credentials & OAuth**: NextAuth with MongoDB persistence.
* **Fail-Safe Guest Engine**: Guarantees zero 500 server crashes even if database environment variables are temporarily unconfigured on host servers.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Styling & UI** | [Vanilla CSS Tokens](https://developer.mozilla.org/en-US/docs/Web/CSS) + [Tailwind CSS](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) + [Mongoose](https://mongoosejs.com/) |
| **Hosting & CI/CD** | [Netlify](https://www.netlify.com/) |

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### 1. Clone Repository
```bash
git clone https://github.com/Mahesh-4017/Music-Streaming-App.git
cd Music-Streaming-App
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXTAUTH_SECRET=your_nextauth_secret_key_2026
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/musify
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Production Build

To build the project for production deployment:
```bash
npm run build
npm run start
```

---

## 🤝 Contributing & Support

Created by **Mahesh** for music enthusiasts. Feel free to open an issue or pull request to improve features!

* 🌟 **GitHub Repository**: [Mahesh-4017/Music-Streaming-App](https://github.com/Mahesh-4017/Music-Streaming-App.git)
* ⚡ **Deployed Site**: [music-streaming-app-03.netlify.app](https://music-streaming-app-03.netlify.app/)

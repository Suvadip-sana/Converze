# Converze

**Converze** is a real-time video conferencing and collaboration platform inspired by Zoom and Google Meet. It offers robust features including video calling, group chat, screen sharing, and secure meeting history tracking, all delivered through a user-friendly interface.

---

#  Demo

Experience the live version of Converze here: [Converze](https://converze.onrender.com/)

---

#  Features

- **Video Calling**: Real-time peer-to-peer video communication  
- **Group Chat**: Text messaging during video sessions  
- **Screen Sharing**: Share your screen for presentations or collaboration  
- **Meeting History**: View and manage previous meeting records  
- **Clean UI/UX**: Intuitive interface for seamless interaction  
- **Responsive Design**: Works well across devices and screen sizes

---

#  Tech Stack

- **Frontend**: React JS  
- **Backend**: Node.js, Express
- **Real-Time Communication**: WebRTC (for video, audio, screen streaming), WebSockets (for chat and signaling)  
- **Deployment**: Hosted on Render.com  
- **Data Storage**: MongoDB (Meeting history logs)

---

#  Architecture

Converze follows a client-server model:

1. **Frontend** handles UI elements: video feeds, chat, screen sharing controls.  
2. **Backend** manages signaling for WebRTC, chat messages routing, meeting history persistence.  
3. **WebRTC** powers the video/audio and screen share streams.  
4. **WebSockets** enable real-time chat and connection orchestration.  
5. **Database** stores meeting metadata and history for retrieval.

---

#  Setup & Installation

## Prerequisites

- Node.js (v14+) and npm/yarn installed  
- Clone this repository:

```bash
git clone https://github.com/Suvadip-sana/Converze.git
cd Converze
```

## 🛠 Installation

### Backend

```bash
cd backend
npm install
# or
yarn
```
### Frontend
```bash
cd ../frontend
npm install
# or
yarn
```

---

# Environment Variables

Create a .env file in the backend/ directory and add the following (example):
```bash
PORT=5000
DB_URI=your_database_connection_string
JWT_SECRET=your_jwt_secret
```

---

# Running Locally

From the project root directory:
```bash
cd backend
npm run start
# or
npm run dev   # if using nodemon
```

In another terminal:
```bash
cd ../frontend
npm run start
```

Frontend will run on: `http://localhost:3000`

Backend will run on: `http://localhost:5000`

Ensure both servers are running simultaneously.

---

# Usage

1. Open the frontend URL in your browser.
2. Start a new meeting or join using a meeting link.
3. Use video calling, chat, and screen sharing features.
4. End the meeting and view it in the Meeting History section.

---

# Screenshots / GIFs

![converze](https://github.com/user-attachments/assets/ab69cc6a-57c7-4ffb-a041-914a4dd682a7)

---

# Contact

### Suvadip Sana
Full-Stack Developer

GitHub: @Suvadip-sana

Email: suvadipsana602@gmail.com

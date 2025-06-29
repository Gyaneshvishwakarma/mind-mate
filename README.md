# 🧠 MindMate - Productivity Dashboard

MindMate is a modern productivity dashboard built with **Next.js 14**, **Firebase Auth**, **MongoDB Atlas**, and **Groq AI**. It helps you manage your:

* ✅ Tasks
* 📝 Notes
* 🌟 Goals
* 📁 Projects
* ⏱️ Focus Sessions (Pomodoro)
* 🧠 AI Responses (via Groq LLaMA-3)

---

## 🚀 Features

* 🔐 **Authentication** using Firebase Auth with Google Sign-In
* 🗂️ CRUD operations for tasks, notes, goals, and projects
* 🧠 AI assistant powered by [Groq LLaMA3-8B-8192](https://groq.com/)
* 🧈 Pomodoro-style focus session tracking with analytics
* 🔎 Search notes and filter tasks by project/status
* ☁️ Data stored in MongoDB (Atlas)
* ⚙️ User settings saved and persisted
* 🧄 Modular, RESTful API routes via `/api/...`

---

## 🤩 Tech Stack

| Technology    | Usage                         |
| ------------- | ----------------------------- |
| Next.js 14    | App routing, frontend/backend |
| Firebase Auth | Authentication & session      |
| MongoDB Atlas | NoSQL data storage            |
| Groq SDK      | LLM chat completions          |
| Tailwind CSS  | UI styling                    |

---

## 🥉 Folder Structure

```
mindmate/
├── app/
│   ├── api/             → API routes (CRUD, AI)
│   └── (pages)          → App pages (Dashboard, Auth, etc.)
├── components/          → Reusable UI components
├── lib/                 → Firebase, DB, and helper functions
├── styles/              → Tailwind configs
├── public/              → Assets
└── .env.local           → Environment variables (🔒 keep secret)
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root with the following:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/mindmate?retryWrites=true&w=majority
MONGODB_DB=mindmate

# Groq AI
GROQ_API_KEY=your_groq_api_key
```

---

## 🧪 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Gyaneshvishwakarma/mindmate.git
cd mindmate
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your `.env.local`

Fill in Firebase, MongoDB Atlas, and Groq keys.

### 4. Run the app locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧠 AI Assistant

This app integrates Groq's LLaMA 3 model using their official SDK.

**Prompt format:**

* System prompt: "You are a helpful AI assistant..."
* User prompt: Based on input from the frontend
* Model used: `llama3-8b-8192`

---

## 📦 Deployment

You can deploy it easily on:

* **Vercel** (Recommended)
* **Netlify**
* **Render**
* Or your own VPS

Make sure to add all your environment variables to the deployment platform.

---

## 📌 Roadmap

* [x] Firebase Auth
* [x] CRUD APIs
* [x] Groq AI support
* [x] Pomodoro timer with stats
* [ ] Markdown editor for notes
* [ ] Drag-and-drop task reordering
* [ ] Mobile responsiveness
* [ ] Offline mode

---

## 👨‍💻 Author

Made by **Gyanesh** with ❤️
[GitHub](https://github.com/Gyaneshvishwakarma) | [LinkedIn]([https://linkedin.com/in/gyanesh](https://www.linkedin.com/in/gyanesh-vishwakarma-01a159245/))

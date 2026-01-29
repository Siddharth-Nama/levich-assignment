# Deployment Guide

This project consists of a **React Frontend** and a **Node.js/Socket.io Backend**.

> **⚠️ IMPORTANT LIMITATION**: Vercel is designed for serverless functions and static sites. It **does NOT support persistent WebSocket connections** (which are required for the live bidding feature).
>
> **Solution**: We will deploy the **Frontend to Vercel** and the **Backend to Render** (or Railway). Both offer free tiers.

---

## Part 1: Database Setup (MongoDB Atlas)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2.  Create a database user (username/password).
3.  Get the connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/levich_auction?retryWrites=true&w=majority`
4.  **Save this URI**, you will need it for the Backend deployment.

---

## Part 2: Backend Deployment (Render)
1.  Push your code to GitHub.
2.  Sign up at [Render.com](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repo.
5.  **Settings**:
    *   **Root Directory**: `server`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
6.  **Environment Variables**:
    *   `MONGO_URI`: (Paste your MongoDB Atlas connection string from Part 1)
    *   `PORT`: `5000` (Render might override this, but good to set)
7.  Click **Deploy Web Service**.
8.  Once live, copy the **Backend URL** (e.g., `https://levich-api.onrender.com`).

---

## Part 3: Frontend Deployment (Vercel)
1.  Sign up at [Vercel.com](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repo.
4.  **Project Settings**:
    *   **Root Directory**: Click "Edit" and select `client`.
    *   **Framework Preset**: Vite.
5.  **Environment Variables**:
    *   Name: `VITE_API_URL`
    *   Value: (Paste your Render Backend URL from Part 2, e.g., `https://levich-api.onrender.com`)
    *   *Note: Do not add a trailing slash.*
6.  Click **Deploy**.

---

## Summary
*   **Frontend**: Hosted on Vercel (serves the UI).
*   **Backend**: Hosted on Render (handles API and WebSockets).
*   **Database**: Hosted on MongoDB Atlas (stores data).
*   **Communication**: The Vercel frontend connects to the Render backend via the `VITE_API_URL`.

# FlytBase Drone Survey Management System

> **Live Application**: [Click Here to Open App](https://flytbase-assessment.vercel.app/)  
> **Backend API**: [Live Server](https://truesateassignment.pythonanywhere.com)  
> **Repository**: [GitHub](https://github.com/Siddharth-Nama/flytbase-assessment)

## Overview
Welcome to my submission for the FlytBase Frontend Design Challenge. I have engineered a high-performance **Drone Survey Management System (DSMS)** that transforms complex flight parameters into actionable, real-time survey missions. 

This project goes beyond a basic CRUD application—it is a full-featured **Command & Control Station**. It integrates interactive 2D mapping (Leaflet), 3D visualization (Three.js), and real-time state management to simulate a professional drone operations environment. I built this to handle the "power user" workflow of mission planning, execution, and monitoring with an emphasis on **Tactical UI Design** and **Mobile Responsiveness**.

## Tech Stack
*   **Frontend**: React (Vite) for a reliable, high-speed UI. 
    *   **Mapping**: React-Leaflet for interactive waypoint planning.
    *   **3D Visualization**: React-Three-Fiber for the drone HUD.
    *   **Styling**: Modular Vanilla CSS with a custom "Night Vision" Design System.
*   **Backend**: Django & Django REST Framework (DRF) for a stateless, scalable mission control API.
*   **Database**: SQLite (Dev) / PostgreSQL (Prod ready).
*   **Tools**: Git/GitHub for version control.

## Why This Project Stands Out?
*   **Architectural Purity**: Strict separation of concerns. The backend serves raw mission data and drone telemetry, while the frontend handles the simulation logic and visualization state.
*   **Tactical "Command Center" UI**: Unlike generic admin dashboards, this interface is designed for operations. High-contrast colors, monospaced data readouts, and glassmorphism panels create an immersive experience.
*   **Advanced Mission Planning**: 
    *   **Interactive Waypoints**: Click-to-drop mapping logic.
    *   **Crosshatch Generator**: Algorithmic generation of grid patterns for survey coverage.
    *   **Mission Config**: Granular control over Altitude, Speed, Overlap, and Sensors.
*   **Real-time Simulation**: The frontend features a custom simulation loop that interpolates drone position along the flight path, providing realistic "In Progress" feedback with estimated time remaining.
*   **Mobile "Tactical Mode"**: A fully responsive mobile layout that transforms the dashboard into a field-ready companion app with bottom navigation and touch-optimized controls.

## Implementation Details
### Core Features
1.  **Dashboard & Fleet Management**: 
    *   Real-time aggregation of active vs. ready drones.
    *   3D Interactive Drone Viewer using React-Three-Fiber.
2.  **Mission Control**:
    *   **Planning**: Drag-and-drop easy interface (click based).
    *   **Execution**: Start, Pause, Resume, and Abort capabilities utilizing a robust State Machine.
    *   **Monitoring**: Live progress bar and telemetry updates.
3.  **Crosshatch Algorithm**:
    *   Automatically generates a 50m zig-zag survey pattern based on a starting anchor point.
4.  **Data Persistence**:
    *   All missions and configurations are validated via DRF Serializers and persisted in the database.

### Technical Highlights
*   **Global Error Handling**: React Error Boundaries prevent white-screen crashes.
*   **Optimized Rendering**: `useMemo` and `useCallback` hooks prevent unnecessary re-renders during rapid map updates.
*   **Responsive Engine**: A custom CSS media-query layer that completely reflows the grid layout for mobile devices without JavaScript overhead.

## Candidate Profile: Siddharth Nama
*"I don't just write code; I build solutions that scale."*

Hello! I'm **Siddharth Nama**, a passionate Software Engineer Intern from Kota, India. I thrive on solving complex backend challenges and crafting seamless user experiences. My journey involves:

*   **Spearheading "Suvidha Manch"** at the Haryana Government (C4GT), where I helped digitize 25,000+ roads.
*   **Optimizing performance** at Mercato Agency, creating systems that handle 10,000+ users with ease.
*   **Driving innovation** with AI-powered platforms like Scripty and AiProgress.
*   **Leading teams** and delivering results under pressure, from managing election portals to restocking systems.

I am fit for this role because I combine strong technical fundamentals (Django, React, Systems Design) with an ownership mindset. I treat every assignment like a production release—focusing on edge cases, maintainability, and user impact. I am ready to bring this energy and precision to the FlytBase team!

**Let's Connect:**
*   [LinkedIn](#)
*   [GitHub](https://github.com/Siddharth-Nama)
*   [LeetCode](#)
*   **Email**: siddharthnama.work@gmail.com
*   **Phone**: +91-8000694996

## Setup Instructions
Clone the repository:
```bash
git clone https://github.com/Siddharth-Nama/flytbase-assessment.git
cd flytbase-assessment
```

### Backend Setup
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---
*© 2026 Developed by Siddharth Nama*

# System Architecture & Design

## 1. High-Level Design
The Live Bidding Platform follows a **Event-Driven Architecture** utilizing WebSockets for real-time communication, supported by a REST API for initial state hydration.

```mermaid
graph TD
    User["User / Bidder"] -->|HTTP/WebSocket| Frontend["React SPA (Vite)"]
    Frontend -->|REST API (Initial Load)| Backend["Node.js + Express"]
    Frontend -->|Socket.io (Bids/Updates)| Backend
    Backend -->|Mongoose| DB[("MongoDB")]
    
    subgraph "Frontend Layer"
        Context["Auction Context"]
        SocketHook["useSocket Hook"]
        Components["UI Components (ItemCard, Timer)"]
    end
    
    subgraph "Backend Layer"
        API["REST Routes (/items)"]
        SocketEngine["Socket Handler"]
        AtomicLock["Atomic Database Operations"]
    end
```

## 2. Project Structure
The project uses a monorepo-style structure separating client and server.

### 2.1 Backend Structure (`/server`)
```text
server/
├── config/
│   └── db.js              # Database connection logic
├── models/
│   └── Item.js            # Mongoose Schema & Indexing
├── routes/
│   └── itemRoutes.js      # REST API endpoints
├── tests/                 # Jest/Supertest Unit Tests
├── server.js              # Entry Point & Express Setup
├── socket.js              # Real-time event handlers
└── seedItems.js           # Data seeding script
```

### 2.2 Frontend Structure (`/client`)
```text
client/
├── src/
│   ├── components/        # Reusable UI Components
│   │   ├── BidButton.jsx
│   │   ├── CountdownTimer.jsx
│   │   └── ItemCard.jsx
│   ├── context/
│   │   └── AuctionContext.jsx  # Global State Management
│   ├── hooks/
│   │   └── useSocket.js        # Websocket Abstraction
│   ├── App.jsx            # Main Layout
│   └── main.jsx           # App Entry & Providers
└── tailwind.config.js     # Styling Configuration
```

## 3. Backend Design (Deep Dive)
The backend is optimized for concurrency and real-time performance.

### 3.1 Data Modeling (`Item.js`)
*   **Item**: Stores auction states.
*   **Atomic Updates**: We avoid "read-modify-write" cycles in code. Instead, we use MongoDB's atomic operators to handle bids.

### 3.2 REST API (`itemRoutes.js`)
*   `GET /items`: Fetches the initial state of all auctions. Used when the page first loads to populate the grid.

### 3.3 Real-Time Engine (`socket.js`)
*   **Event: BID_PLACED**:
    *   Receives `itemId`, `amount`.
    *   Performs database update with concurrency check.
    *   Emits result (Success/Error).
*   **Event: UPDATE_BID**:
    *   Broadcasts the new state of an item to *all* connected clients immediately after a successful bid.

## 4. Frontend Design (React)
### Component Architecture
*   **Global State**: `AuctionContext` holds the master list of items. This avoids prop-drilling and ensures all components view the same data.
*   **Socket Integration**: `useSocket` initializes the connection once and provides the socket instance to the app. The `App` component listens for global updates (`UPDATE_BID`) and dispatches actions to the Context.

### Visual Feedback System
*   **Optimistic UI (Partial)**: While we wait for server confirmation to confirm a "Win", prompt feedback (like button states) improves perceived performance.
*   **Flash Animation**: CSS transitions triggered by state changes alert users to activity without being intrusive.

## 5. Deployment Architecture (Docker)
The application is fully containerized.
*   **Server**: Node.js Alpine image.
*   **Client**: Multi-stage build (Node build -> Serve static).
*   **Orchestration**: `docker-compose` spins up the Mongo database, Backend, and Frontend in a shared network.

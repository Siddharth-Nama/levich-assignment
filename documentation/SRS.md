# Software Requirements Specification (SRS)
**Project:** Live Bidding Platform (Levich Assignment)
**Version:** 1.0
**Status:** Released

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the software requirements for the "Live Bidding Platform". This system is a real-time auction application designed to allow users to view items, place bids in real-time, and receive instant feedback on their status (Winning/Outbid).

### 1.2 Scope
The system focuses on the final moments of an auction where concurrency handling is critical. The scope includes:
-   **Auction Dashboard**: A grid view of active auction items.
-   **Real-Time Bidding**: Instant broadcasting of bids to all connected clients.
-   **Concurrency Control**: Preventing race conditions when multiple users bid simultaneously.
-   **Visual Feedback**: Immediate UI updates for price changes and user status.

### 1.3 Tech Stack Definitions
*   **Frontend**: React (Vite) + Tailwind CSS (Styling) + Socket.io-client.
*   **Backend**: Node.js + Express + Socket.io.
*   **Database**: MongoDB (Mongoose) for persistence.
*   **Infrastructure**: Docker + Docker Compose.

---

## 2. Overall Description

### 2.1 User Classes
*   **Bidder**: The primary user. Can view items and place bids to compete for ownership.
*   **Administrator**: (Implicit) Manages item inventory via database seeding/API.

### 2.2 Operating Environment
*   **Client**: Modern Web Browsers (Chrome, Firefox, Edge, Safari).
*   **Server**: Node.js Runtime (v18+).
*   **Container**: Docker environment.

---

## 3. System Features (Functional Requirements)

### 3.1 Auction Dashboard
*   **FR-01 (Item Display)**: The dashboard must display a grid of auction items, showing Title, Current Price, and Time Remaining.
*   **FR-02 (Countdown)**: Each item must have a countdown timer synced with the server's end time.

### 3.2 Bidding Mechanism
*   **FR-03 (Bid Placement)**: Users must be able to place a bid (fixed increment +$10) by clicking a button.
*   **FR-04 (Validation)**: The system must reject bids if:
    *   The auction time has ended.
    *   The bid amount is not higher than the current highest bid.
*   **FR-05 (Race Condition Handling)**: If multiple users place valid bids simultaneously, the system must process them atomically and accept only the first valid one, rejecting others with an "Outbid" error.

### 3.3 Real-Time Feedback
*   **FR-06 (Price Update)**: The current price must update instantly on all clients when a valid bid is accepted.
*   **FR-07 (Visual Indicators)**:
    *   **Green Flash**: The price should flash green when updated.
    *   **Winning Status**: The current highest bidder should see a "Winning" badge.
    *   **Outbid Status**: A user who was previously winning but is now outbid should see an "Outbid" alert.

---

## 4. Non-Functional Requirements

### 4.1 Performance
*   **Latency**: Bids should be broadcasted with sub-second latency via WebSockets.
*   **Concurrency**: The backend must handle high volumes of simultaneous requests without data inconsistency.

### 4.2 Reliability
*   **Data Integrity**: The final selling price must accurately reflect the highest accepted bid.
*   **Recovery**: The system should gracefully handle socket disconnections and reconnect automatically.

### 4.3 Scalability
*   **Containerization**: The application must be containerized using Docker for consistent deployment across environments.

---

## 5. Data Model (Schema Description)

### 5.1 Entities
*   **Item**: Auction Item.
    *   `title` (String): Name of the item.
    *   `startingPrice` (Number): Initial price.
    *   `currentBid` (Number): Highest accepted bid amount.
    *   `endTime` (Date): Auction expiration timestamp.
    *   `highestBidderSocketId` (String): Identifier for the current winning user (for session tracking).

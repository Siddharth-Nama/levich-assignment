# Low-Level Technical Design (LLD)

**Project:** Live Bidding Platform (Levich Assignment)
**Scope:** Concurrency Logic, Socket protocol, and State Management.

---

## 1. Backend Logic (Node.js)

### 1.1 Race Condition Strategy (The "Check-and-Set" Pattern)
Handling simultaneous bids is the core challenge.
*   **Problem**: Two users bid $100 at the same time. Validating inside Node.js (`if current < 100`) then saving (`save()`) creates a gap where both could pass validity checks before writing, leading to lost updates.
*   **Solution**: Push the logic to the Database (MongoDB).
    *   Query: `findOneAndUpdate`
    *   **Filter Condition**: 
        ```javascript
        {
          _id: itemId,
          currentBid: { $lt: newAmount }, // CRITICAL: only match if DB value is STILL lower
          endTime: { $gt: now }           // CRITICAL: only match if not expired
        }
        ```
    *   **Update Operation**:
        ```javascript
        {
           $set: { currentBid: newAmount, highestBidderSocketId: userSocketId }
        }
        ```
    *   **Outcome**: If the condition fails (someone else updated the DB 1ms ago), the operation returns `null`. We treat this as an "Outbid" error.

### 1.2 Socket Protocol
| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `BID_PLACED` | Client -> Server | `{ itemId, amount }` | User attempts to bid. |
| `UPDATE_BID` | Server -> Client (Broadcast) | `Item Object` | Successful bid accepted. Update UI. |
| `BID_ERROR` | Server -> Client (Unicast) | `{ message }` | Bid rejected (Outbid/Ended). |

---

## 2. Frontend Logic (React)

### 2.1 State Management (`AuctionContext`)
We use a Context + Reducer pattern (simplified via `useState` for this scale) to handle the items array.
*   **`updateItem(newItem)`**: Helper function that finds an item by `_id` in the fake-store and replaces it. This triggers a re-render for only the affected components (in a larger app, we'd memoize this).

### 2.2 Visual Logic (`ItemCard.jsx`)
*   **Winning Detection**:
    ```javascript
    const isWinning = socketId && item.highestBidderSocketId === socketId;
    ```
*   **Outbid Detection**:
    ```javascript
    const isOutbid = hasBidded && !isWinning;
    ```
    *   We track a local flag `hasBidded` to know if the user *ever* participated in this auction. If they did, but they aren't winning anymore, they are "Outbid".

### 2.3 The Countdown (`CountdownTimer.jsx`)
*   **Sync**: We trust the `endTime` from the server.
*   **Tick**: Uses `setInterval` (1000ms).
*   **Correction**: On every render/update of `endTime` (e.g., if auction was extended), the timer recalculates to correct any drift.

---

## 3. Styling Strategy (Tailwind CSS)

### 3.1 Glassmorphism
We use semi-transparent backgrounds with blur filters to achieve the modern look.
*   Class: `backdrop-blur-md bg-white/80`
*   Effect: Creates a "frosted glass" layered effect over the background gradient.

### 3.2 Micro-Interactions
*   **Button Press**: `active:scale-95` gives tactile feedback.
*   **Status Flash**: `animate-pulse` draws attention to urgent status changes (Outbid).

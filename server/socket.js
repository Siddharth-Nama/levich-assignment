const Item = require('./models/Item');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('BID_PLACED', async (data) => {
      const { itemId, amount } = data;

      try {
        // Race Condition Strategy: 
        // Use atomic findOneAndUpdate with condition that currentBid < amount.
        // This ensures if two concurrent requests come, only one matches the condition.
        const updatedItem = await Item.findOneAndUpdate(
          { 
            _id: itemId, 
            currentBid: { $lt: amount },
            endTime: { $gt: new Date() } 
          },
          { 
            $set: { 
              currentBid: amount,
              highestBidderSocketId: socket.id 
            } 
          },
          { new: true }
        );

        if (updatedItem) {
          io.emit('UPDATE_BID', updatedItem);
        } else {
          // Failure analysis
          const item = await Item.findById(itemId);
          if (!item) {
            socket.emit('BID_ERROR', { message: 'Item not found' });
          } else if (new Date() > item.endTime) {
            socket.emit('BID_ERROR', { message: 'Auction ended' });
          } else {
            socket.emit('BID_ERROR', { message: 'Outbid! valid bid must be higher.' });
          }
        }
      } catch (error) {
        console.error('Bid error:', error);
        socket.emit('BID_ERROR', { message: 'Server error' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;

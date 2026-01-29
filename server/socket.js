const Item = require('./models/Item');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    
    socket.on('BID_PLACED', async (data) => {
      const { itemId, amount } = data;

      try {
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
    });
  });
};

module.exports = socketHandler;

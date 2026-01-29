const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  startingPrice: {
    type: Number,
    required: true,
  },
  currentBid: {
    type: Number,
    required: true,
    default: function() {
      return this.startingPrice;
    }
  },
  endTime: {
    type: Date,
    required: true,
  },
  highestBidderSocketId: {
    type: String,
    default: null
  },
}, { timestamps: true });

// Index for efficient querying if needed, though standard ID query is fast.
// We might want an index on endTime to find active auctions efficiently if we were scaling.
ItemSchema.index({ endTime: 1 });

module.exports = mongoose.model('Item', ItemSchema);

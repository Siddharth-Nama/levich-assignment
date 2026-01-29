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

ItemSchema.index({ endTime: 1 });

module.exports = mongoose.model('Item', ItemSchema);

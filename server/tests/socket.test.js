const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');
const Item = require('../models/Item');
const socketHandler = require('../socket');

jest.mock('../models/Item');

describe('Socket Logic', () => {
  let io, serverSocket, clientSocket;
  let httpServer;

  beforeAll((done) => {
    httpServer = createServer();
    io = new Server(httpServer);
    socketHandler(io);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
    httpServer.close();
  });

  test('should broadcast UPDATE_BID on valid BID_PLACED', (done) => {
    const mockItem = {
       _id: 'itemId',
       currentBid: 150,
       endTime: new Date(Date.now() + 10000)
    };
    
    // Condition matches
    const updatedItem = { ...mockItem, currentBid: 200, highestBidderSocketId: 'clientSocketId' };
    
    Item.findOneAndUpdate.mockResolvedValue(updatedItem);

    clientSocket.emit('BID_PLACED', { itemId: 'itemId', amount: 200 });

    clientSocket.on('UPDATE_BID', (item) => {
      try {
        expect(item.currentBid).toBe(200);
        expect(Item.findOneAndUpdate).toHaveBeenCalled();
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  test('should emit BID_ERROR on fail', (done) => {
    // Condition fails (returns null)
    Item.findOneAndUpdate.mockResolvedValue(null);
    Item.findById.mockResolvedValue({ endTime: new Date(Date.now() + 10000) });

    clientSocket.emit('BID_PLACED', { itemId: 'itemId', amount: 100 });

    clientSocket.on('BID_ERROR', (err) => {
      try {
        expect(err.message).toBeDefined();
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});

const request = require('supertest');
const mongoose = require('mongoose');
const Item = require('../models/Item');

// Mock dependencies
jest.mock('../models/Item');
jest.mock('../config/db', () => jest.fn());

// Start server
let server;

beforeAll(() => {
  server = require('../server');
});

afterAll((done) => {
  server.close(done);
});

describe('GET /items', () => {
  it('should return all items', async () => {
    const mockItems = [
      { _id: '1', title: 'Item 1', startingPrice: 100, currentBid: 100 },
      { _id: '2', title: 'Item 2', startingPrice: 200, currentBid: 200 },
    ];
    
    // Mock find implementations
    Item.find.mockResolvedValue(mockItems);

    const res = await request(server).get('/items');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].title).toEqual('Item 1');
    expect(Item.find).toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const errorMessage = 'Database Error';
    Item.find.mockRejectedValue(new Error(errorMessage));

    const res = await request(server).get('/items');

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual(errorMessage);
  });
});

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const itemRoutes = require('./routes/itemRoutes');
const socketHandler = require('./socket');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

socketHandler(io);

app.use((req, res, next) => {
    req.io = io;
    next();
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/items', itemRoutes);

app.get('/', (req, res) => {
  res.send('Live Bidding Platform API is running');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;

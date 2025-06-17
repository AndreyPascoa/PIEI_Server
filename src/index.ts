import express from 'express';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import http from 'http';
import { log } from 'console';
import { GPT } from './services/chat';

const cors = require('cors');
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT || 5000;

dotenv.config();
app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/projeto').default);
app.use('/api', require('./routes/tasks').default);
app.use('/api', require('./routes/notion').default);
app.use('/api', require('./routes/auth').default);
app.use('/api', require('./routes/register').default);
app.use('/api', require('./routes/card').default);

wss.on('connection', (ws) => {
  console.log('Novo cliente conectado');

  ws.on('message', async (message) => {
    const response = await GPT(message.toString());
    ws.send(JSON.stringify({ message: response }));
  });

  ws.on('close', () => {
    log('Cliente desconectado');
  })
})

server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`WebSocket escutando em ws://localhost:${port}`);
});

// server.js
const WebSocket = require('ws');

//import WebSocket from 'ws'; // Import the WebSocket library

const PORT = 5900;
//const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

const wss = new WebSocket.Server({ port: PORT }, () => {
    console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});

wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send a welcome message to the client
    ws.send(JSON.stringify({ message: 'Welcome to the WebSocket test server!' }));

    // Echo messages back to the client
    ws.on('message', (data) => {
        console.log(`Received: ${data}`);
        ws.send(`Echo: ${data}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error: ${error}`);
    });
});

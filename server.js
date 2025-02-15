const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files from current directory
app.use(express.static('./'));

// Create HTTPS server
const server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app);

server.listen(3000, '192.168.0.255', () => {
    console.log('Server running at https://localhost:3000/');
    console.log('On your phone, visit: https://YOUR_IP:3000');
}); 
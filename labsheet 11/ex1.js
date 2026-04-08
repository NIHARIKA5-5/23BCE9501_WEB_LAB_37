// Import http module
const http = require('http');

// Create server
const server = http.createServer((req, res) => {
    
    // Set response header
    res.setHeader('Content-Type', 'text/plain');

    // Handle request
    if (req.url === '/') {
        res.write('Welcome to Node.js Server!');
    } else if (req.url === '/about') {
        res.write('This is About Page');
    } else {
        res.write('Page Not Found');
    }

    // End response
    res.end();
});

// Define port
const PORT = 3000;

// Start server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
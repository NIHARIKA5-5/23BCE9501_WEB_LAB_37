const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

// ─── Global Middleware 1: Request Logger ───────────────────────────────────────
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[LOGGER] ${timestamp} | Method: ${req.method} | URL: ${req.url}`);
  next(); // pass control to next middleware
});

// ─── Global Middleware 2: Request Counter ─────────────────────────────────────
let requestCount = 0;
app.use((req, res, next) => {
  requestCount++;
  console.log(`[COUNTER] Total requests so far: ${requestCount}`);
  next();
});

// ─── Global Middleware 3: Auth Simulator ──────────────────────────────────────
app.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    console.log(`[AUTH] Authorization header found: ${authHeader}`);
    req.authenticated = true;
  } else {
    console.log('[AUTH] No authorization header - proceeding as guest');
    req.authenticated = false;
  }
  next();
});

// ─── Route-Level Middleware: Admin Check ──────────────────────────────────────
const adminCheck = (req, res, next) => {
  const role = req.headers['role'];
  if (role === 'admin') {
    console.log('[ADMIN CHECK] Admin access granted');
    next();
  } else {
    console.log('[ADMIN CHECK] Access denied - not an admin');
    res.status(403).json({ message: 'Admin access required' });
  }
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// Public route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Middleware Demo!',
    authenticated: req.authenticated,
    requestCount,
  });
});

// Route with route-level middleware
app.get('/admin', adminCheck, (req, res) => {
  res.json({ message: 'Welcome, Admin! This is a protected route.' });
});

// Another route to show middleware chaining
app.post('/data', (req, res) => {
  console.log('[ROUTE] /data route handler reached');
  res.json({ message: 'Data received', body: req.body });
});

// Start server
app.listen(PORT, () => {
  console.log(`Middleware demo server running at http://localhost:${PORT}`);
});
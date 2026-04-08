// Import events module
const EventEmitter = require('events');

// Create emitter object
const emitter = new EventEmitter();

// Listener 1
emitter.on('greet', (name) => {
    console.log(`Hello ${name}!`);
});

// Listener 2
emitter.on('greet', (name) => {
    console.log(`Welcome ${name} to Node.js`);
});

// Another event
emitter.on('bye', () => {
    console.log('Goodbye!');
});

// Emit events
emitter.emit('greet', 'Niharika');
emitter.emit('bye');
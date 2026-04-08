// Import fs module
const fs = require('fs');

// 1. Create & Write file
fs.writeFile('sample.txt', 'Hello, Node.js!', (err) => {
    if (err) throw err;
    console.log('File created and written successfully');

    // 2. Read file
    fs.readFile('sample.txt', 'utf8', (err, data) => {
        if (err) throw err;
        console.log('File Content:', data);

        // 3. Append data
        fs.appendFile('sample.txt', '\nAppended Text!', (err) => {
            if (err) throw err;
            console.log('Data appended');

            // 4. Delete file
            fs.unlink('sample.txt', (err) => {
                if (err) throw err;
                console.log('File deleted successfully');
            });
        });
    });
});

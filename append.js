const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

// Create the server
const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // Serve the HTML form
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <form action="/append" method="POST">
        <label for="file1">First File Name:</label>
        <input type="text" id="file1" name="file1" required>
        <br>
        <label for="file2">Second File Name:</label>
        <input type="text" id="file2" name="file2" required>
        <br>
        <button type="submit">Append Content</button>
      </form>
    `);
  } else if (req.method === 'POST' && req.url === '/append') {
    // Handle form submission
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // Convert Buffer to string
    });
    req.on('end', () => {
      const { file1, file2 } = querystring.parse(body);

      // Read the content of the first file
      fs.readFile(file1, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('Error reading the first file.');
        }

        // Append the content to the second file
        fs.appendFile(file2, data, (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Error appending to the second file.');
          }
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Content appended successfully!');
        });
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


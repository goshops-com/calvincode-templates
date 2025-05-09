const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Create Express app, HTTP server and Socket.IO server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Track last known file hashes
let lastUxHash = null;
let lastPreviewHash = null;

// Serve static files
app.use(express.static('./'));

// Parse JSON body for the save endpoint
app.use(express.json({ limit: '10mb' }));

// Default UX file path
const uxFilePath = path.join(__dirname, 'ux.json');
const previewFilePath = path.join(__dirname, 'preview.html');

// Create default ux.json if it doesn't exist
if (!fs.existsSync(uxFilePath)) {
  console.log('Creating default ux.json file...');
  
  // Create a default Excalidraw file with a rectangle and text
  const defaultUxState = {
    type: "excalidraw",
    version: 2,
    source: "excalidraw-auto-refresh",
    elements: [
      {
        id: "rectangle1",
        type: "rectangle",
        x: 100,
        y: 100,
        width: 200,
        height: 100,
        angle: 0,
        strokeColor: "#000000",
        backgroundColor: "#4a8df6",
        fillStyle: "solid",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        groupIds: [],
        frameId: null,
        roundness: {
          type: 3
        },
        seed: 1042,
        version: 1,
        versionNonce: 1234567890,
        isDeleted: false
      },
      {
        id: "text1",
        type: "text",
        x: 150,
        y: 140,
        width: 100,
        height: 20,
        angle: 0,
        strokeColor: "#000000",
        backgroundColor: "transparent",
        fillStyle: "hachure",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        groupIds: [],
        frameId: null,
        roundness: null,
        seed: 1043,
        version: 1,
        versionNonce: 1234567891,
        isDeleted: false,
        text: "Hello World",
        fontSize: 20,
        fontFamily: 1,
        textAlign: "center",
        verticalAlign: "middle"
      }
    ],
    appState: {
      viewBackgroundColor: "#ffffff",
      gridSize: 20
    }
  };
  
  fs.writeFileSync(uxFilePath, JSON.stringify(defaultUxState, null, 2));
  console.log('Default ux.json file created');
}

// Compute MD5 hash of file content
function getMd5Hash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

// API endpoint to save state
app.post('/save-state', (req, res) => {
  try {
    console.log('Received save request');
    const data = req.body;
    
    if (!data || !data.elements) {
      return res.status(400).send('Invalid state data: missing elements array');
    }
    
    // Add required Excalidraw metadata if not present
    if (!data.type) {
      data.type = "excalidraw";
    }
    if (!data.version) {
      data.version = 2;
    }
    if (!data.source) {
      data.source = "excalidraw-auto-refresh";
    }
    
    console.log(`Saving state with ${data.elements.length} elements`);
    
    // Write to ux.json file
    fs.writeFileSync(uxFilePath, JSON.stringify(data, null, 2));
    console.log('State saved successfully');
    
    // We don't emit here because the file watcher will handle it
    res.status(200).send('State saved successfully');
  } catch (err) {
    console.error('Error saving state:', err);
    res.status(500).send('Error saving state: ' + err.message);
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected, id:', socket.id);
  
  // Send current file content immediately on connection
  try {
    const fileContent = fs.readFileSync(uxFilePath, 'utf8');
    lastUxHash = getMd5Hash(fileContent);
    socket.emit('initial-state', fileContent);
    console.log('Sent initial state to client');
  } catch (err) {
    console.error('Error reading initial state:', err);
    socket.emit('error', 'Error reading state file');
  }
  
  socket.on('disconnect', () => {
    console.log('Client disconnected, id:', socket.id);
  });
});

// Watch for changes to ux.json
let fsWatcher = null;
let previewWatcher = null;

function setupWatcher() {
  if (fsWatcher) {
    fsWatcher.close();
  }
  
  if (previewWatcher) {
    previewWatcher.close();
  }
  
  console.log('Setting up file watcher for:', uxFilePath);
  
  try {
    fsWatcher = fs.watch(uxFilePath, (eventType) => {
      if (eventType === 'change') {
        console.log('ux.json file changed');
        
        // Add a small delay to ensure the file is completely written
        setTimeout(() => {
          try {
            const fileContent = fs.readFileSync(uxFilePath, 'utf8');
            
            // Validate JSON
            JSON.parse(fileContent);
            
            // Check if content actually changed using MD5
            const currentHash = getMd5Hash(fileContent);
            if (currentHash !== lastUxHash) {
              lastUxHash = currentHash;
              // Broadcast to all clients
              io.emit('file-updated', fileContent);
              console.log('Notified all clients about file update');
            } else {
              console.log('File content unchanged, skipping notification');
            }
          } catch (err) {
            console.error('Error reading updated file:', err);
          }
        }, 100);
      }
    });
    
    // Only set up preview watcher if the file exists
    if (fs.existsSync(previewFilePath)) {
      console.log('Setting up file watcher for:', previewFilePath);
      
      previewWatcher = fs.watch(previewFilePath, (eventType) => {
        if (eventType === 'change') {
          console.log('preview.html file changed');
          
          // Add a small delay to ensure the file is completely written
          setTimeout(() => {
            try {
              const fileContent = fs.readFileSync(previewFilePath, 'utf8');
              
              // Check if content actually changed using MD5
              const currentHash = getMd5Hash(fileContent);
              if (currentHash !== lastPreviewHash) {
                lastPreviewHash = currentHash;
                // Broadcast to all clients
                io.emit('preview-updated', fileContent);
                console.log('Notified all clients about preview update');
              } else {
                console.log('Preview content unchanged, skipping notification');
              }
            } catch (err) {
              console.error('Error reading updated preview file:', err);
            }
          }, 100);
        }
      });
    } else {
      console.log('preview.html does not exist, skipping watcher setup');
    }
    
    console.log('File watchers set up successfully');
  } catch (err) {
    console.error('Error setting up file watchers:', err);
    
    // Try again in 5 seconds
    setTimeout(setupWatcher, 5000);
  }
}

// Start the server
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  setupWatcher();
});

// Handle server shutdown
process.on('SIGINT', () => {
  if (fsWatcher) {
    fsWatcher.close();
  }
  if (previewWatcher) {
    previewWatcher.close();
  }
  server.close(() => {
    console.log('Server shut down');
    process.exit(0);
  });
});
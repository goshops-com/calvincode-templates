const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 8000;

// Configuration constants
const JUPYTER_TOKEN = '48c1af71a3e789adccd7cb46a6ff59ec1150f7a34c27471c';
const JUPYTER_BASE_URL = 'https://jupyter.apps.calvincode.net';

// Parse JSON bodies
app.use(express.json());

// Simple middleware to add iframe headers and CORS support
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' build.calvincode.ai *.calvincode.ai");
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Disable caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve the file list at the root route
app.get('/', (req, res) => {
  // Function to get notebook files
  const getNotebookFiles = () => {
    try {
      const notebooksDir = path.join(__dirname, 'notebooks');
      
      // If directory doesn't exist, return empty array
      if (!fs.existsSync(notebooksDir)) {
        return [];
      }

      return fs.readdirSync(notebooksDir)
        .filter(file => file.endsWith('.ipynb'))
        .map(file => ({
          name: file,
          path: file,
          modified: fs.statSync(path.join(notebooksDir, file)).mtime
        }));
    } catch (error) {
      console.error('Error reading notebooks directory:', error);
      return [];
    }
  };

  // HTML for the file listing with Tailwind styling
  const filesHtml = getNotebookFiles()
    .map(file => {
      const jupyterUrl = `${JUPYTER_BASE_URL}/notebooks/${process.env.PROJECT_ID}/${file.name}?token=${JUPYTER_TOKEN}&ts=${Date.now()}`;
      const modifiedDate = file.modified.toLocaleString();
      
      return `
        <tr class="hover:bg-gray-700">
          <td class="py-3 px-4">
            <a href="${jupyterUrl}" target="_blank" class="text-blue-400 hover:text-blue-300 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              ${file.name}
            </a>
          </td>
          <td class="py-3 px-4 text-gray-400">${modifiedDate}</td>
          <td class="py-3 px-4 text-right">
            <button 
              data-filename="${encodeURIComponent(file.name)}"
              class="delete-btn bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm transition-colors inline-block"
            >
              Delete
            </button>
          </td>
        </tr>
      `;
    })
    .join('');

  // Complete HTML response with Tailwind CSS
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Jupyter Notebooks</title>
      <script src="/tailwild.js"></script>
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .refresh-animation { animation: pulse 1s ease-in-out; }
        
        /* Modal styles */
        .modal {
          display: none;
          position: fixed;
          z-index: 1000;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          align-items: center;
          justify-content: center;
        }
        
        .modal-content {
          background-color: #2d3748;
          border-radius: 0.5rem;
          padding: 1.5rem;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .modal-show {
          display: flex;
        }
      </style>
    </head>
    <body class="bg-gray-900 min-h-screen text-gray-100">
      <div class="container mx-auto px-4 py-8">
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div class="px-6 py-4 bg-indigo-900 text-white flex justify-between items-center">
            <h1 class="text-xl font-bold">Calvin Code Notebooks</h1>
            <div class="flex items-center">
              <span id="refresh-status" class="text-sm mr-3 opacity-0"></span>
              <span id="last-refreshed" class="text-sm">Last refreshed: ${new Date().toLocaleString()}</span>
            </div>
          </div>
          
          <div id="file-list-container" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th class="py-3 px-4 text-left text-gray-300 font-semibold bg-gray-700">File Name</th>
                  <th class="py-3 px-4 text-left text-gray-300 font-semibold bg-gray-700">Last Modified</th>
                  <th class="py-3 px-4 text-right text-gray-300 font-semibold bg-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody id="file-list" class="divide-y divide-gray-700">
                ${filesHtml.length ? filesHtml : `
                  <tr>
                    <td colspan="3" class="py-8 text-center text-gray-400">
                      No notebook files found in ./notebooks
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Custom confirmation modal -->
      <div id="delete-modal" class="modal">
        <div class="modal-content">
          <h3 class="text-lg font-semibold mb-3">Confirm Deletion</h3>
          <p id="modal-message" class="mb-4 text-gray-300">Are you sure you want to delete this file? This action cannot be undone.</p>
          <div class="flex justify-end gap-3">
            <button id="cancel-delete" class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md">Cancel</button>
            <button id="confirm-delete" class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md">Delete</button>
          </div>
        </div>
      </div>

      <script>
        let currentHash = '';
        
        // Custom modal logic
        const modal = document.getElementById('delete-modal');
        const modalMessage = document.getElementById('modal-message');
        const cancelDelete = document.getElementById('cancel-delete');
        const confirmDelete = document.getElementById('confirm-delete');
        let currentFilename = null;
        
        // Handle delete button clicks
        document.addEventListener('click', function(e) {
          if (e.target.classList.contains('delete-btn')) {
            const filename = e.target.getAttribute('data-filename');
            showDeleteModal(filename);
          }
        });
        
        // Show delete confirmation modal
        function showDeleteModal(filename) {
          currentFilename = filename;
          const decodedFilename = decodeURIComponent(filename);
          modalMessage.textContent = 'Are you sure you want to delete ' + decodedFilename + '? This action cannot be undone.';
          modal.classList.add('modal-show');
        }
        
        // Close modal
        cancelDelete.addEventListener('click', function() {
          modal.classList.remove('modal-show');
          currentFilename = null;
        });
        
        // Confirm delete
        confirmDelete.addEventListener('click', function() {
          if (currentFilename) {
            window.location.href = '/api/delete/' + currentFilename;
          }
          modal.classList.remove('modal-show');
        });
        
        function refreshFileList() {
          const refreshStatus = document.getElementById('refresh-status');
          const fileListContainer = document.getElementById('file-list-container');
          
          refreshStatus.textContent = 'Refreshing...';
          refreshStatus.classList.add('opacity-100');
          
          fetch(window.location.href + 'api/files')
            .then(function(response) { return response.json(); })
            .then(function(data) {
              if (data.hash === currentHash) {
                refreshStatus.classList.remove('opacity-100');
                return;
              }
              
              currentHash = data.hash;
              const fileList = document.getElementById('file-list');
              fileListContainer.classList.add('refresh-animation');
              
              if (data.files.length === 0) {
                fileList.innerHTML = '<tr><td colspan="3" class="py-8 text-center text-gray-400">No notebook files found in ./notebooks</td></tr>';
              } else {
                let htmlContent = '';
                
                for (let i = 0; i < data.files.length; i++) {
                  const file = data.files[i];
                  htmlContent += '<tr class="hover:bg-gray-700">';
                  htmlContent += '<td class="py-3 px-4">';
                  htmlContent += '<a href="' + file.url + '" target="_blank" class="text-blue-400 hover:text-blue-300 flex items-center">';
                  htmlContent += '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
                  htmlContent += file.name;
                  htmlContent += '</a>';
                  htmlContent += '</td>';
                  htmlContent += '<td class="py-3 px-4 text-gray-400">' + file.modified + '</td>';
                  htmlContent += '<td class="py-3 px-4 text-right">';
                  htmlContent += '<button data-filename="' + encodeURIComponent(file.name) + '" ';
                  htmlContent += 'class="delete-btn bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm transition-colors inline-block">';
                  htmlContent += 'Delete</button>';
                  htmlContent += '</td>';
                  htmlContent += '</tr>';
                }
                
                fileList.innerHTML = htmlContent;
              }
              
              document.getElementById('last-refreshed').textContent = 'Last refreshed: ' + new Date().toLocaleString();
              
              setTimeout(function() {
                refreshStatus.classList.remove('opacity-100');
                fileListContainer.classList.remove('refresh-animation');
              }, 500);
            })
            .catch(function(error) {
              console.error('Error fetching file list:', error);
              refreshStatus.textContent = 'Error refreshing';
              setTimeout(function() {
                refreshStatus.classList.remove('opacity-100');
              }, 2000);
            });
        }
        
        refreshFileList();
        setInterval(refreshFileList, 5000);
      </script>
    </body>
    </html>
  `;

  res.send(html);
});

// API endpoint to get file list
app.get('/api/files', (req, res) => {
  try {
    const notebooksDir = path.join(__dirname, 'notebooks');
    
    if (!fs.existsSync(notebooksDir)) {
      return res.json({ files: [], hash: '' });
    }

    const files = fs.readdirSync(notebooksDir)
      .filter(file => file.endsWith('.ipynb'))
      .map(file => {
        const stats = fs.statSync(path.join(notebooksDir, file));
        return {
          name: file,
          path: file,
          modified: stats.mtime.toLocaleString(),
          url: `${JUPYTER_BASE_URL}/notebooks/${process.env.PROJECT_ID}/${file}?token=${JUPYTER_TOKEN}&ts=${Date.now()}`
        };
      });

    const hash = crypto.createHash('md5').update(JSON.stringify(files)).digest('hex');
    res.json({ files, hash });
  } catch (error) {
    console.error('Error reading notebooks directory:', error);
    res.status(500).json({ error: 'Failed to read notebooks directory' });
  }
});

// API endpoint to delete a file
app.delete('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  console.log(`Delete request received for file: ${filename}`);
  
  try {
    const filepath = path.join(__dirname, 'notebooks', filename);
    console.log(`Attempting to delete file at path: ${filepath}`);
    
    // Check if file exists
    if (!fs.existsSync(filepath)) {
      console.log(`File not found: ${filepath}`);
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    
    // Delete the file
    fs.unlinkSync(filepath);
    console.log(`File deleted successfully: ${filepath}`);
    
    return res.json({ success: true, message: `${filename} deleted successfully` });
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete file', details: error.message });
  }
});

// API endpoint for a simpler delete operation via GET (fallback for DELETE method issues)
app.get('/api/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  console.log(`Delete request (GET) received for file: ${filename}`);
  
  try {
    const filepath = path.join(__dirname, 'notebooks', filename);
    console.log(`Attempting to delete file at path: ${filepath}`);
    
    // Check if file exists
    if (!fs.existsSync(filepath)) {
      console.log(`File not found: ${filepath}`);
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    
    // Delete the file
    fs.unlinkSync(filepath);
    console.log(`File deleted successfully: ${filepath}`);
    
    // Redirect back to home page after successful deletion
    return res.redirect('/');
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete file', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving notebook files from ./notebooks`);
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

// Configuration constants
const JUPYTER_TOKEN = '48c1af71a3e789adccd7cb46a6ff59ec1150f7a34c27471c';
const JUPYTER_BASE_URL = 'https://jupyter.apps.calvincode.net';

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
      const jupyterUrl = `${JUPYTER_BASE_URL}/notebooks/${process.env.PROJECT_ID}/${file.name}?token=${JUPYTER_TOKEN}`;
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
      </style>
    </head>
    <body class="bg-gray-900 min-h-screen text-gray-100">
      <div class="container mx-auto px-4 py-8">
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div class="px-6 py-4 bg-indigo-900 text-white flex justify-between items-center">
            <h1 class="text-xl font-bold">Jupyter Notebooks</h1>
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
                </tr>
              </thead>
              <tbody id="file-list" class="divide-y divide-gray-700">
                ${filesHtml.length ? filesHtml : `
                  <tr>
                    <td colspan="2" class="py-8 text-center text-gray-400">
                      No notebook files found in ./notebooks
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <script>
        // Function to refresh the file list every 5 seconds
        function refreshFileList() {
          const refreshStatus = document.getElementById('refresh-status');
          const fileListContainer = document.getElementById('file-list-container');
          
          // Show refreshing indicator
          refreshStatus.textContent = 'Refreshing...';
          refreshStatus.classList.add('opacity-100');
          
          fetch(window.location.href + 'api/files')
            .then(response => response.json())
            .then(data => {
              const fileList = document.getElementById('file-list');
              
              // Apply refresh animation
              fileListContainer.classList.add('refresh-animation');
              
              // Update the file list
              if (data.files.length === 0) {
                fileList.innerHTML = \`
                  <tr>
                    <td colspan="2" class="py-8 text-center text-gray-400">
                      No notebook files found in ./notebooks
                    </td>
                  </tr>
                \`;
              } else {
                fileList.innerHTML = data.files.map(file => \`
                  <tr class="hover:bg-gray-700">
                    <td class="py-3 px-4">
                      <a href="\${file.url}" target="_blank" class="text-blue-400 hover:text-blue-300 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        \${file.name}
                      </a>
                    </td>
                    <td class="py-3 px-4 text-gray-400">\${file.modified}</td>
                  </tr>
                \`).join('');
              }
              
              // Update last refreshed time
              document.getElementById('last-refreshed').textContent = 'Last refreshed: ' + new Date().toLocaleString();
              
              // Hide refreshing indicator after a short delay
              setTimeout(() => {
                refreshStatus.classList.remove('opacity-100');
                fileListContainer.classList.remove('refresh-animation');
              }, 500);
            })
            .catch(error => {
              console.error('Error fetching file list:', error);
              refreshStatus.textContent = 'Error refreshing';
              setTimeout(() => refreshStatus.classList.remove('opacity-100'), 2000);
            });
        }
        
        // Refresh immediately on load
        refreshFileList();
        
        // Set up interval for refreshing every 5 seconds
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
    
    // If directory doesn't exist, return empty array
    if (!fs.existsSync(notebooksDir)) {
      return res.json({ files: [] });
    }

    const files = fs.readdirSync(notebooksDir)
      .filter(file => file.endsWith('.ipynb'))
      .map(file => {
        const stats = fs.statSync(path.join(notebooksDir, file));
        return {
          name: file,
          path: file,
          modified: stats.mtime.toLocaleString(),
          url: `${JUPYTER_BASE_URL}/notebooks/${process.env.PROJECT_ID}/${file}?token=${JUPYTER_TOKEN}`
        };
      });

    res.json({ files });
  } catch (error) {
    console.error('Error reading notebooks directory:', error);
    res.status(500).json({ error: 'Failed to read notebooks directory' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving notebook files from ./notebooks`);
});
